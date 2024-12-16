import React, { ReactNode } from 'react';
import { APIProvider } from './APIContext';
import { ModelManagementProvider } from './ModelManagementContext';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ModelManagementProvider>
      <APIProvider>
        {children}
      </APIProvider>
    </ModelManagementProvider>
  );
}

// Export all context hooks for convenience
export { useModelManagement, useReplicate } from './ModelManagementContext';
export { useAPI, useGroq, useElevenLabs, useHedra } from './APIContext';
