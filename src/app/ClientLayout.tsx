'use client';

import { ReactNode } from 'react';
import ReduxProvider from '@/app/redux-provider';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';

const FirebaseAnalytics = dynamic(
    () => import('@/components/FirebaseAnalytics').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => null,
    }
);

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ReduxProvider>
            {children}
            <Toaster position="top-center" richColors />
            <FirebaseAnalytics />
        </ReduxProvider>
    );
}