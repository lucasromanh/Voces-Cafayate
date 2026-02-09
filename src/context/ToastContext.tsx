import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info, Download, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'loading' | 'download';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (type !== 'loading') {
            setTimeout(() => hideToast(id), 5000);
        }
    }, [hideToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className="pointer-events-auto"
                        >
                            <ToastComponent toast={toast} onClose={() => hideToast(toast.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastComponent: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle2 className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        loading: <Loader2 className="text-primary animate-spin" size={20} />,
        download: <Download className="text-orange-500" size={20} />
    };

    const bgColors = {
        success: 'bg-green-50/90 border-green-100',
        error: 'bg-red-50/90 border-red-100',
        info: 'bg-blue-50/90 border-blue-100',
        loading: 'bg-gray-50/90 border-gray-100',
        download: 'bg-orange-50/90 border-orange-100'
    };

    return (
        <div className={`flex items-center gap-4 px-6 py-4 rounded-3xl border shadow-2xl backdrop-blur-md min-w-[300px] max-w-md ${bgColors[toast.type]}`}>
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <div className="flex-1">
                <p className="text-xs font-black text-gray-900 uppercase tracking-widest opacity-40 mb-0.5">
                    {toast.type === 'download' ? 'Descarga' : toast.type === 'loading' ? 'Procesando' : 'Sistema'}
                </p>
                <p className="text-sm font-bold text-gray-800 leading-tight">
                    {toast.message}
                </p>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X size={16} className="text-gray-400" />
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
