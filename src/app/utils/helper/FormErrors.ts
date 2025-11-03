import { FieldValues, UseFormSetError } from 'react-hook-form'

export function handleFormErrors<T extends FieldValues>(
    setError: UseFormSetError<T>,
    error: any
) {
    if (error && typeof error === 'object') {
        Object.entries(error).forEach(([field, message]) => {
            setError(field as any, { type: 'server', message: message as string })
        })
        return true
    }
    return false
}
