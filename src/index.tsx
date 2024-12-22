import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage } from './pages/ExamplePage';
import { ModelManagementProvider } from './contexts/ModelManagementContext';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ModelManagementProvider>
      <ExamplePage />
    </ModelManagementProvider>
  </React.StrictMode>
);
