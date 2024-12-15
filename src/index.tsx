import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExamplePage } from './pages/ExamplePage';
import { ReplicateProvider } from './contexts/ReplicateContext';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReplicateProvider>
      <ExamplePage />
    </ReplicateProvider>
  </React.StrictMode>
);
