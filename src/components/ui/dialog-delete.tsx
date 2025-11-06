import React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface DialogDeleteProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    subtitle?: string
    deleteQuestion: string
    isLoading?: boolean
}

export default function DialogDelete({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title,
                                         subtitle = 'Hành động này sẽ không thể hoàn tác',
                                         deleteQuestion,
                                         isLoading,
                                     }: DialogDeleteProps) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
        >            <DialogContent className="sm:max-w-[480px] w-full p-6 bg-white rounded-2xl shadow-2xl dark:bg-gray-900">
                <DialogHeader className="flex flex-col items-center text-center gap-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-2">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>

                    <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {title}
                    </DialogTitle>

                    {/* subtitle gần title hơn */}
                    <p className="text-sm text-orange-500 dark:text-orange-400 -mt-1">
                        {subtitle}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        <span className="font-medium text-red-600">{deleteQuestion}</span>
                    </p>
                </DialogHeader>


                <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 sm:flex-none sm:w-32 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        className="flex-1 sm:flex-none sm:w-32 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition"
                        onClick={onConfirm}
                    >
                        {isLoading ? 'Đang xóa...' : 'Xóa'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
