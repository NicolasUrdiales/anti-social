import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-indigo-400" />,
};

const bg = {
  success: "bg-green-50 dark:bg-green-950/60 border-green-200 dark:border-green-900",
  error: "bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900",
  info: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900",
};

const textColor = {
  success: "text-green-800 dark:text-green-300",
  error: "text-red-800 dark:text-red-300",
  info: "text-indigo-800 dark:text-indigo-300",
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg animate-scale-in ${bg[toast.type]} ${textColor[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
