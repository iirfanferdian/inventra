"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface DummyItem {
  name: string;
  sku: string;
  price: number;
  category: string;
  description: string;
  initialStock: number;
}

interface DummyTransaction {
  itemIndex: number;
  type: "IN" | "OUT";
  quantity: number;
  date: Date;
  note: string;
}

const DUMMY_ITEMS: DummyItem[] = [
  {
    name: "Laptop Dell XPS 13",
    sku: "SKU-DELL-XPS-001",
    price: 15000000,
    category: "Electronics",
    description: "Premium laptop with FHD display, Intel i7 processor",
    initialStock: 5,
  },
  {
    name: "Mouse Logitech MX Master 3",
    sku: "SKU-LOGI-MOUSE-001",
    price: 850000,
    category: "Electronics",
    description: "Wireless ergonomic mouse with high precision",
    initialStock: 20,
  },
  {
    name: "Keyboard Mechanical RGB",
    sku: "SKU-KEY-MECH-001",
    price: 1200000,
    category: "Electronics",
    description: "Mechanical keyboard with Cherry MX switches",
    initialStock: 15,
  },
  {
    name: "Monitor LG 27 Inch 4K",
    sku: "SKU-LG-MON-001",
    price: 3500000,
    category: "Electronics",
    description: "4K UHD monitor with high color accuracy",
    initialStock: 8,
  },
  {
    name: "Premium Cotton T-Shirt",
    sku: "SKU-TSHIRT-PREM-001",
    price: 150000,
    category: "Fashion",
    description: "100% premium cotton t-shirt, comfortable to wear",
    initialStock: 50,
  },
  {
    name: "Slim Fit Chino Pants",
    sku: "SKU-CHINO-SLIM-001",
    price: 250000,
    category: "Fashion",
    description: "Modern chino pants with slim fit cut",
    initialStock: 30,
  },
  {
    name: "Premium Arabica Coffee 500g",
    sku: "SKU-COFFEE-ARAB-001",
    price: 120000,
    category: "Food & Beverage",
    description: "Selected arabica coffee beans from highlands",
    initialStock: 100,
  },
  {
    name: "Organic Matcha Tea",
    sku: "SKU-MATCHA-ORG-001",
    price: 180000,
    category: "Food & Beverage",
    description: "Premium organic matcha tea from Japan",
    initialStock: 40,
  },
];

// Generate realistic transactions spread across 3 months
function generateDummyTransactions(): DummyTransaction[] {
  const transactions: DummyTransaction[] = [];
  const today = new Date(2026, 2, 19); // March 19, 2026
  const threeMonthsAgo = new Date(2025, 11, 19); // December 19, 2025

  // Generate transactions for each day in the range
  for (
    let date = new Date(threeMonthsAgo);
    date <= today;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();

    // Restock: 1-2x per week (Monday & Friday)
    if (dayOfWeek === 1 || dayOfWeek === 5) {
      if (Math.random() > 0.3) {
        transactions.push({
          itemIndex: Math.floor(Math.random() * DUMMY_ITEMS.length),
          type: "IN",
          quantity: Math.floor(Math.random() * 20) + 5, // 5-25 items
          date: new Date(date),
          note: "Restocked product",
        });
      }
    }

    // Sales: 2-5x per week (random)
    if (Math.random() > 0.4) {
      const numTransactions = Math.floor(Math.random() * 3) + 1; // 1-3 transactions per day
      for (let i = 0; i < numTransactions; i++) {
        transactions.push({
          itemIndex: Math.floor(Math.random() * DUMMY_ITEMS.length),
          type: "OUT",
          quantity: Math.floor(Math.random() * 5) + 1, // 1-5 items
          date: new Date(date),
          note: `Sales #${Math.floor(Math.random() * 1000)}`,
        });
      }
    }
  }

  return transactions;
}

// Helper function to create items in batch
async function createItemsInBatch(
  userId: string,
  items: DummyItem[],
): Promise<{ id: string; price: unknown }[]> {
  const createdItems = [];

  for (const itemData of items) {
    const item = await prisma.item.create({
      data: {
        name: itemData.name,
        sku: itemData.sku,
        price: itemData.price,
        description: itemData.description,
        currentStock: itemData.initialStock,
        minStock: Math.floor(itemData.initialStock * 0.2),
        user: {
          connect: { id: userId },
        },
        category: {
          connectOrCreate: {
            where: {
              name_userId: {
                name: itemData.category,
                userId: userId,
              },
            },
            create: {
              name: itemData.category,
              userId: userId,
            },
          },
        },
      },
    });
    createdItems.push({ id: item.id, price: item.price });
  }

  return createdItems;
}

// Helper function to create transactions in smaller batches to avoid timeout
async function createTransactionsInBatches(
  userId: string,
  createdItems: { id: string; price: unknown }[],
  transactions: DummyTransaction[],
  batchSize: number = 50,
): Promise<number> {
  let totalCreated = 0;
  // Track current stock for each item to prevent negative stock
  const currentStocks: Record<string, number> = {};

  // Initialize current stocks from initial stock amounts
  for (const item of createdItems) {
    const initialItem = DUMMY_ITEMS.find((di) => di.price === item.price);
    if (initialItem) {
      currentStocks[item.id] = initialItem.initialStock;
    }
  }

  for (let i = 0; i < transactions.length; i += batchSize) {
    const batch = transactions.slice(i, i + batchSize);
    const finalStocks: Record<string, number> = {};

    // Create batch transaction
    await prisma.$transaction(
      async (tx) => {
        for (const transaction of batch) {
          const item = createdItems[transaction.itemIndex];

          try {
            // For OUT transactions, check if we have enough stock
            if (
              transaction.type === "OUT" &&
              currentStocks[item.id] < transaction.quantity
            ) {
              // Skip this transaction if not enough stock
              console.warn(
                `Skipping OUT transaction for item ${item.id}: insufficient stock (have ${currentStocks[item.id]}, need ${transaction.quantity})`,
              );
              continue;
            }

            // Create transaction record
            await tx.transaction.create({
              data: {
                type: transaction.type,
                quantity: transaction.quantity,
                priceAtTransaction: item.price as unknown as number,
                note: transaction.note,
                itemId: item.id,
                userId: userId,
                createdAt: transaction.date,
              },
            });

            // Track stock changes
            const operation =
              transaction.type === "IN"
                ? transaction.quantity
                : -transaction.quantity;

            if (!finalStocks[item.id]) {
              finalStocks[item.id] = 0;
            }
            finalStocks[item.id] += operation;
            // Update current stock tracker
            currentStocks[item.id] += operation;

            totalCreated++;
          } catch (error) {
            console.error("Error creating single transaction:", error);
          }
        }

        // Update all item stocks for this batch
        for (const [itemId, stockChange] of Object.entries(finalStocks)) {
          await tx.item.update({
            where: { id: itemId },
            data: { currentStock: { increment: stockChange } },
          });
        }
      },
      { timeout: 60000 }, // 60 seconds for batch operations
    );
  }

  return totalCreated;
}

export const seedDummyData = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized - please login first",
    };
  }

  try {
    // Check if user already has items
    const existingItems = await prisma.item.count({
      where: {
        userId: session.user.id,
      },
    });

    if (existingItems > 0) {
      return {
        success: false,
        message:
          "Dummy data already exists. Please delete items first if you want to add new data.",
      };
    }

    const userId = session.user.id;

    // Step 1: Create all items (not in transaction to avoid timeout)
    const createdItems = await createItemsInBatch(userId, DUMMY_ITEMS);
    const itemCount = createdItems.length;

    // Step 2: Generate transactions
    const generatedTransactions = generateDummyTransactions();

    // Step 3: Create transactions in smaller batches
    const transactionCount = await createTransactionsInBatches(
      userId,
      createdItems,
      generatedTransactions,
      50,
    );

    return {
      success: true,
      message: `Dummy data successfully added! ${itemCount} items, ${transactionCount} transactions`,
      data: { itemCount, transactionCount },
    };
  } catch (error) {
    console.error("Error seeding dummy data:", error);
    return {
      success: false,
      message: `Failed to add dummy data: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
