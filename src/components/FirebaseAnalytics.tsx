'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logPageView } = useAnalytics();

  useEffect(() => {
    if (pathname) {
      // Log page view when the pathname changes
      logPageView(
        document.title || 'Untitled Page',
        pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      );
    }
  }, [pathname, searchParams, logPageView]);

  return null;
}

export default FirebaseAnalytics;
