-- Drop existing unique constraint on sku
ALTER TABLE "Item" DROP CONSTRAINT IF EXISTS "Item_sku_key";

-- Add composite unique constraint for sku per user
CREATE UNIQUE INDEX "Item_sku_userId_key" ON "Item"("sku", "userId");
