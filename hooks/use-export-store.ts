import { create } from "zustand";

// Definisikan tipe data per kategori agar lebih aman
export type ExportType = "inventory" | "transactions" | "reports";

interface ExportStore {
  data: any[];
  type: ExportType | null;
  // Tambahkan state loading jika nanti data yang diambil sangat besar
  isPreparing: boolean;

  setExportData: (data: any[], type: ExportType) => void;
  clearExport: () => void;
}

export const useExportStore = create<ExportStore>((set) => ({
  data: [],
  type: null,
  isPreparing: false,

  setExportData: (data, type) => {
    // Gunakan callback set untuk memastikan state terbaru
    set({ data, type, isPreparing: false });
  },

  clearExport: () => set({ data: [], type: null, isPreparing: false }),
}));
