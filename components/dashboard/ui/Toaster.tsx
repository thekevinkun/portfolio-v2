"use client";

import { Toaster as SonnerToaster } from "sonner";

// Mounted once in the (admin) layout; call toast() from sonner anywhere below it
const Toaster = () => {
  return <SonnerToaster theme="dark" position="bottom-right" closeButton />;
};

export default Toaster;
