import { type ElementType, type ReactNode } from 'react';

type ContainerProps<T extends ElementType = 'div'> = {
  children: ReactNode;
  className?: string;
  as?: T;
};

export default function Container<T extends ElementType = 'div'>({
  children,
  className = '',
  as,
}: ContainerProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={`mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8${className ? ` ${className}` : ''}`}
    >
      {children}
    </Component>
  );
}
