"use client";

import { StoreModal } from "@/components/modals/StoreModal";
import { useEffect, useState } from "react";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  // Mount the component on client-side only.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // for the server side, we ensure that we don't render anything,
  // so that we prevent any possible mismatch between the server and the client (hydration errors)
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
}
