import { X } from "lucide-react";
import { Button } from "./Button";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl transition-all duration-300 text-center scale-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            className="rounded-full px-5 font-bold"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            className="rounded-full px-5 font-bold"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
