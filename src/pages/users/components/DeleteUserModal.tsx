// modal.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md mx-auto z-10">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="p-4">{children}</div>
        <div className="p-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
};