import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  theme: 'light' | 'dark';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Clear History',
  cancelText = 'Cancel',
  theme,
}) => {
  if (!isOpen) return null;

  const bgClass = theme === 'dark' ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200';
  const textClass = theme === 'dark' ? 'text-slate-200' : 'text-slate-900';
  const subTextClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className={`relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${bgClass} animate-in fade-in zoom-in duration-200`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${textClass}`}>{title}</h3>
            <p className={`text-xs ${subTextClass} leading-relaxed mt-1`}>
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all active:scale-95"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border ${theme === 'dark' ? 'border-slate-800 text-slate-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
          >
            {cancelText}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-500 hover:bg-slate-500/10"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;