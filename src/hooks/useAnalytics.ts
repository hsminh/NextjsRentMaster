import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export const useAnalytics = () => {
  const logEventAnalytics = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== 'undefined' && analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  };

  const logPageView = (pageTitle: string, pagePath: string) => {
    logEventAnalytics('page_view', {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: window.location.href
    });
  };

  return { logEvent: logEventAnalytics, logPageView };
};

export default useAnalytics;
