import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CRTEffect from "../CRTEffect";

interface ModalProps {
  show: boolean;
  onClose?: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export function Modal({
  show,
  onClose,
  title,
  children,
  description,
}: ModalProps) {
  return (
    <Dialog.Root open={show} onOpenChange={() => onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="text-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-full max-w-md border border-green-500/30 rounded-lg p-4 font-mono z-50 focus:outline-none">
          <CRTEffect>
            <Dialog.Title className="border-b border-green-500/30 pb-2 mb-4">
              {title}
            </Dialog.Title>

            {description && (
              <Dialog.Description className="text-green-500/70 mb-4 text-base">
                {description}
              </Dialog.Description>
            )}

            {children}

            <p className="text-abse text-green-500/50 mt-6 text-center">
              Press ESC to close
            </p>
          </CRTEffect>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
