interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = "Delete",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-white">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-2">{title}</h2>
                <p className="text-sm text-gray-400 mb-6">{message}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-800 text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}