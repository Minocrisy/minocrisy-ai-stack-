import React, { ReactNode } from 'react';
import { ReplicateProvider } from './ReplicateContext';
import { APIProvider } from './APIContext';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ReplicateProvider>
      <APIProvider>
        {children}
      </APIProvider>
    </ReplicateProvider>
  );
}

// Export all context hooks for convenience
export { useReplicate } from './ReplicateContext';
export { useAPI, useGroq, useElevenLabs, useHedra } from './APIContext';
