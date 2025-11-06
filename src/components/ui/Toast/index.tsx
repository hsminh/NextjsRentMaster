import { toast } from 'sonner'

const recentErrorMessages = new Map<string, number>()
const ERROR_TOAST_DEBOUNCE_TIME = 3000

const ctoasst = {
    success: (message: string) => {
        toast.success(message)
    },
    error: (message: string, options?: { allowDuplicates?: boolean }) => {
        if (options?.allowDuplicates) {
            toast.error(message)
            return
        }

        const now = Date.now()
        const lastShown = recentErrorMessages.get(message)

        if (lastShown && now - lastShown < ERROR_TOAST_DEBOUNCE_TIME) {
            return
        }

        toast.error(message)
        recentErrorMessages.set(message, now)

        setTimeout(() => {
            recentErrorMessages.delete(message)
        }, ERROR_TOAST_DEBOUNCE_TIME)
    },
}

export default ctoasst
