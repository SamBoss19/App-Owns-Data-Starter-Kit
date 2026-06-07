import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}

// Replaces MUI <Dialog>: a centered card over a dimmed, click-to-close backdrop.
const Modal = ({ open, onClose, title, children, actions }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md rounded bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="px-6 pt-5 pb-2 text-lg font-medium text-gray-900">{title}</h2>
        <div className="px-6 py-2 text-sm text-gray-700">{children}</div>
        <div className="flex justify-end gap-2 px-4 py-3">{actions}</div>
      </div>
    </div>
  );
};

export default Modal;
