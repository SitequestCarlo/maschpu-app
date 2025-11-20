import { createContextId, useContext, useContextProvider, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

/**
 * Network status context
 * Provides global network connectivity state across the app
 */
export interface NetworkContext {
  isOnline: Signal<boolean>;
}

export const NetworkContextId = createContextId<NetworkContext>('network-context');

/**
 * Hook to access network context
 */
export const useNetworkContext = () => {
  return useContext(NetworkContextId);
};

/**
 * Hook to provide network context - should be used in root component
 */
export const useNetworkProvider = () => {
  const isOnline = useSignal(true);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    const { checkRealConnectivity } = await import('~/utils/pwa');
    
    // Set initial state with real connectivity check
    isOnline.value = await checkRealConnectivity();

    // Listen for online/offline events
    const handleOnline = async () => {
      // Verify real connectivity when browser says we're online
      isOnline.value = await checkRealConnectivity();
    };

    const handleOffline = () => {
      isOnline.value = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also periodically check connectivity (every 30 seconds)
    const intervalId = setInterval(async () => {
      isOnline.value = await checkRealConnectivity();
    }, 30000);

    // Cleanup
    cleanup(() => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    });
  });

  const context: NetworkContext = {
    isOnline,
  };

  useContextProvider(NetworkContextId, context);

  return context;
};
