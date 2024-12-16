import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <div className="layout-container">
      {/* Compact header with configurable content */}
      <header className="header flex items-center justify-between px-4">
        {header}
      </header>

      {/* Main content area with max height and scrolling */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

// Header components that match YOGI.v2's compact design
export const HeaderTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
    {children}
  </h1>
);

export const HeaderActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center space-x-2">
    {children}
  </div>
);

// Example usage:
/*
import { Layout, HeaderTitle, HeaderActions } from './components/Layout';

function App() {
  return (
    <Layout
      header={
        <>
          <HeaderTitle>Your App Name</HeaderTitle>
          <HeaderActions>
            <button className="btn-primary">Action</button>
            <button className="btn-secondary">Another Action</button>
          </HeaderActions>
        </>
      }
    >
      <div className="p-4">
        Your content here
      </div>
    </Layout>
  );
}
*/
