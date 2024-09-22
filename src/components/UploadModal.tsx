"use client";

import React from "react";
import { Modal } from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";

export const UploadModal = () => {
  const { isOpen, onClose, onOpen } = useUploadModal();

  const onChange = (open: boolean) => {
    if (!open) {
      // reset the form
      onClose();
    }
  };

  return (
    <Modal
      title="Upload modal title"
      description="Upload description"
      isOpen={isOpen}
      onChange={onChange}
    >
      Upload Modal
    </Modal>
  );
};
