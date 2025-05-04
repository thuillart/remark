import { create } from "zustand";

type Dialog = "create" | "view" | "update" | "delete" | null;

interface ApiKeyStore {
  open: Dialog;
  setOpen: (open: Dialog) => void;

  apiKey: string | null;
  setApiKey: (apiKey: string | null) => void;

  selectedApiKeyId: string | null;
  setSelectedApiKeyId: (selectedApiKeyId: string | null) => void;
}

export const useApiKeyStore = create<ApiKeyStore>((set) => ({
  open: null,
  setOpen: (open) => set({ open }),

  apiKey: null,
  setApiKey: (apiKey) => set({ apiKey }),

  selectedApiKeyId: null,
  setSelectedApiKeyId: (selectedApiKeyId) => set({ selectedApiKeyId }),
}));
