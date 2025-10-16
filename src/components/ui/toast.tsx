import * as React from "react"

export interface ToastProps {
    id: string
    title?: string
    description?: string
    type?: "success" | "error" | "info" | "warning"
    duration?: number
}

const toastVariants = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
}

const iconVariants = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
}

export function Toast({ id, title, description, type = "info", duration = 5000 }: ToastProps) {
    const [visible, setVisible] = React.useState(true)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration])

    if (!visible) return null

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg transition-all ${toastVariants[type]}`}
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl">{iconVariants[type]}</div>
                <div className="flex-1">
                    {title && <div className="font-semibold">{title}</div>}
                    {description && <div className="text-sm mt-1">{description}</div>}
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

export function useToast() {
    const [toasts, setToasts] = React.useState<ToastProps[]>([])

    const toast = React.useCallback(
        ({ title, description, type = "info", duration = 5000 }: Omit<ToastProps, "id">) => {
            const id = Math.random().toString(36).substring(7)
            setToasts((prev) => [...prev, { id, title, description, type, duration }])
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, duration)
        },
        []
    )

    return {
        toast,
        toasts,
    }
}

export function ToastContainer() {
    const { toasts } = useToast()

    return (
        <>
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} />
            ))}
        </>
    )
}



