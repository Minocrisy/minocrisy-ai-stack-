import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  footer,
  hover = false,
  onClick,
}) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : '';
  const classes = [baseClasses, hoverClasses, className].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {header && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark">
          {footer}
        </div>
      )}
    </div>
  );
};

// Header components for consistent card styling
export const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-gray-500 dark:text-gray-400">
    {children}
  </p>
);

// Example usage:
/*
<Card
  header={
    <div className="flex justify-between items-center">
      <CardTitle>Card Title</CardTitle>
      <Button variant="outline" size="sm">Action</Button>
    </div>
  }
  footer={
    <div className="flex justify-end space-x-2">
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Save</Button>
    </div>
  }
  hover
>
  <CardDescription>
    This is the card content with a description.
  </CardDescription>
</Card>
*/
