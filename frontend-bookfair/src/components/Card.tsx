import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`rounded-lg shadow-md p-6 space-y-4 ${className}`}>
      {children}
    </div>
  );
};