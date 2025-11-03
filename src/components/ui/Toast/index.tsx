'use client'

import React from 'react'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
}

export const toastSuccess = (message: string, options?: ToastOptions) => toast.success(message, { ...defaultOptions, ...options })
export const toastError = (message: string, options?: ToastOptions) => toast.error(message, { ...defaultOptions, ...options })
export const toastInfo = (message: string, options?: ToastOptions) => toast.info(message, { ...defaultOptions, ...options })
export const toastWarn = (message: string, options?: ToastOptions) => toast.warn(message, { ...defaultOptions, ...options })

export function ToastProvider() {
  return <ToastContainer position="bottom-right" newestOnTop pauseOnFocusLoss={false} />
}

export { ToastContainer }
