"use client";

import { useEffect } from "react";
import { trackResearchView } from "@/lib/analytics";

export default function ResearchView({ title, path }) {
  useEffect(() => {
    trackResearchView(title, path);
  }, [title, path]);
  return null;
}
