const baseClassName =
  'mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8';

export default function Container({
  children,
  className = '',
  as: Component = 'div',
}) {
  return (
    <Component className={`${baseClassName}${className ? ` ${className}` : ''}`}>
      {children}
    </Component>
  );
}
