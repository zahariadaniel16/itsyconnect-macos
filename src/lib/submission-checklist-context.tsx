"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface ChecklistFlags {
  hasDescription: boolean;
  hasWhatsNew: boolean;
  hasKeywords: boolean;
}

const defaults: ChecklistFlags = {
  hasDescription: false,
  hasWhatsNew: false,
  hasKeywords: false,
};

interface SubmissionChecklistContextValue {
  flags: ChecklistFlags;
  report: (flags: ChecklistFlags) => void;
}

const SubmissionChecklistContext = createContext<SubmissionChecklistContextValue>({
  flags: defaults,
  report: () => {},
});

export function SubmissionChecklistProvider({ children }: { children: React.ReactNode }) {
  const [flags, setFlags] = useState<ChecklistFlags>(defaults);
  const report = useCallback((f: ChecklistFlags) => setFlags(f), []);

  return (
    <SubmissionChecklistContext.Provider value={{ flags, report }}>
      {children}
    </SubmissionChecklistContext.Provider>
  );
}

export function useSubmissionChecklist() {
  return useContext(SubmissionChecklistContext);
}
