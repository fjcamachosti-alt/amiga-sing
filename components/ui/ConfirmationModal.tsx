
import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                     <AlertTriangle className="h-6 w-6 text-danger" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <p className="text-lg text-on-surface">{message}</p>
                </div>
            </div>
            <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
            </div>
        </div>
    </Modal>
  );
};
