"use client";

import { useStoreModal } from "@/hooks/useStoreModal";
import { useEffect } from "react";

// the only purpose of this page is to open the store setup modal
export default function SetupPage() {
  const onOpen = useStoreModal((store) => store.onOpen);
  const isOpen = useStoreModal((store) => store.isOpen);

  //effect description:
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [onOpen, isOpen]);

  return null;
}
