'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * SessionExpiryHandler Component
 * Listens for session expiry events and shows toast notifications
 * This component should be placed at the root level of your app
 */
export default function SessionExpiryHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handleSessionExpired = (event: CustomEvent) => {
      toast({
        title: 'Session Expired',
        description: event.detail?.message || 'Your session has expired. Please login again.',
        variant: 'destructive',
        duration: 5000,
      });
    };

    // Listen for session expiry events
    window.addEventListener('auth:session-expired', handleSessionExpired as EventListener);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired as EventListener);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}

