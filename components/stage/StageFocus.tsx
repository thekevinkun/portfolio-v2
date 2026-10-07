"use client";

import { useStageFocus } from "@/lib/stage/useStageFocus";

// Mounts the focus management once, inside the provider
const StageFocus = () => {
  useStageFocus();
  return null;
};

export default StageFocus;
