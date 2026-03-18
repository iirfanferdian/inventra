"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import { useExportStore } from "@/hooks/use-export-store";
import * as XLSX from "xlsx";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const ExportButton = () => {
  const { data, type } = useExportStore();
  const [isExporting, setIsExporting] = useState(false);

  // --- FUNGSI 1: PDF (Khusus Reports) ---
  const handleExportPDF = async () => {
    const element = document.getElementById("report-area");
    if (!element) return;

    setIsExporting(true);
    try {
      // 1. Pastikan font sudah termuat
      await document.fonts.ready;

      // 2. Ambil dimensi asli konten agar tidak terpotong
      const originalWidth = element.scrollWidth;
      const originalHeight = element.scrollHeight;

      // 3. Tambahkan styling sementara (Force Light Mode & Full Height)
      element.classList.add("bg-white", "text-black", "p-10");
      element.style.height = "auto";
      element.style.overflow = "visible";

      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2, // Kualitas HD
        skipFonts: true, // Bypass error "font is undefined"
        width: originalWidth,
        height: originalHeight,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });

      // Kembalikan styling asli
      element.classList.remove("bg-white", "text-black", "p-10");
      element.style.height = "";
      element.style.overflow = "";

      // 4. Inisialisasi PDF
      // Menggunakan mode potrait 'p' atau landscape 'l' tergantung kebutuhan
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 5. Masukkan gambar ke PDF (Jika sangat tinggi, PDF akan menyesuaikan)
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Business_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert(
        "Gagal mengekspor PDF. Pastikan semua chart sudah termuat sempurna.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  // --- FUNGSI 2: EXCEL (Inventory & Transactions) ---
  const handleExportExcel = () => {
    if (!data || data.length === 0) return;

    let excelData: any[] = [];
    let fileName = "Data_Export";

    if (type === "inventory") {
      excelData = data.map((item) => ({
        "Item Name": item?.name || "-",
        SKU: item?.sku || "-",
        Category: item?.category?.name || "Uncategorized",
        Stock: item?.currentStock ?? 0,
        "Unit Price": item?.formattedPrice || "0",
      }));
      fileName = "Inventory_Report";
    } else if (type === "transactions") {
      excelData = data.map((t) => ({
        Date: t?.formattedDate
          ? new Date(t.formattedDate).toLocaleDateString()
          : "-",
        Type: t?.type || "-",
        Item: t?.item?.name || "-",
        Price: t?.formattedPrice || "0",
        Qty: t?.quantity ?? 0,
        Note: t?.note || "-",
      }));
      fileName = "Transaction_History";
    }

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Auto-width logic
    const objectMaxLength: any[] = [];
    excelData.forEach((row) => {
      Object.keys(row).forEach((key, i) => {
        const value = row[key] ? row[key].toString() : "";
        objectMaxLength[i] = Math.max(
          objectMaxLength[i] || 10,
          value.length + 2,
        );
      });
    });
    worksheet["!cols"] = objectMaxLength.map((w) => ({ wch: w }));

    XLSX.writeFile(
      workbook,
      `${fileName}_${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  // --- RENDER LOGIC ---
  if (type === "reports") {
    return (
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground flex gap-2"
      >
        {isExporting ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <FileText size={18} />
        )}
        <span>Export PDF Report</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleExportExcel}
      disabled={!data || data.length === 0}
      className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground flex gap-2"
    >
      <FileSpreadsheet size={18} />
      <span>Export Excel</span>
    </Button>
  );
};

export default ExportButton;
