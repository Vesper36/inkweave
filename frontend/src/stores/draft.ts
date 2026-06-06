"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DraftChapter {
  id: string;
  workSlug: string;
  volumeId: string;
  title: string;
  content: string;
  updatedAt: number; // timestamp
  dirty: boolean; // has unsaved changes
}

interface DraftState {
  // Current editing state
  currentDraft: DraftChapter | null;
  isSaving: boolean;
  lastSavedAt: number | null;

  // Recent drafts list
  recentDrafts: DraftChapter[];

  // Actions
  setCurrentDraft: (draft: DraftChapter | null) => void;
  updateContent: (content: string) => void;
  updateTitle: (title: string) => void;
  markSaved: () => void;
  markSaving: (saving: boolean) => void;
  addToRecent: (draft: DraftChapter) => void;
  removeDraft: (id: string) => void;
  clearDrafts: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      currentDraft: null,
      isSaving: false,
      lastSavedAt: null,
      recentDrafts: [],

      setCurrentDraft: (draft) => set({ currentDraft: draft, lastSavedAt: null }),

      updateContent: (content) => {
        const { currentDraft } = get();
        if (!currentDraft) return;
        set({
          currentDraft: { ...currentDraft, content, updatedAt: Date.now(), dirty: true },
        });
      },

      updateTitle: (title) => {
        const { currentDraft } = get();
        if (!currentDraft) return;
        set({
          currentDraft: { ...currentDraft, title, updatedAt: Date.now(), dirty: true },
        });
      },

      markSaved: () => {
        const { currentDraft } = get();
        if (!currentDraft) return;
        set({
          currentDraft: { ...currentDraft, dirty: false },
          lastSavedAt: Date.now(),
        });
      },

      markSaving: (saving) => set({ isSaving: saving }),

      addToRecent: (draft) => {
        const { recentDrafts } = get();
        const filtered = recentDrafts.filter((d) => d.id !== draft.id);
        set({ recentDrafts: [draft, ...filtered].slice(0, 20) });
      },

      removeDraft: (id) => {
        const { recentDrafts } = get();
        set({ recentDrafts: recentDrafts.filter((d) => d.id !== id) });
      },

      clearDrafts: () => set({ recentDrafts: [] }),
    }),
    {
      name: "inkweave-drafts",
      partialize: (state) => ({
        recentDrafts: state.recentDrafts,
      }),
    }
  )
);

// Auto-save hook
export function useAutoSave(intervalMs = 30000) {
  const { currentDraft, isSaving, markSaved, markSaving } = useDraftStore();

  const save = async () => {
    if (!currentDraft?.dirty || isSaving) return;

    markSaving(true);
    try {
      // Save to IndexedDB
      const { set } = await import("idb-keyval");
      await set(`draft:${currentDraft.id}`, {
        ...currentDraft,
        updatedAt: Date.now(),
      });

      // Also save to recent drafts
      useDraftStore.getState().addToRecent(currentDraft);
      markSaved();
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      markSaving(false);
    }
  };

  return { save, isSaving, lastSavedAt: useDraftStore((s) => s.lastSavedAt) };
}
