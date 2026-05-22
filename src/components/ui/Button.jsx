const variantStyles = {
  primary:
    'bg-primary text-dark hover:brightness-95 active:brightness-90',
  outline:
    'border-2 border-dark bg-transparent text-dark hover:bg-dark/5 active:bg-dark/10',
};

const baseStyles =
  'inline-flex items-center justify-center rounded-lg px-8 py-3 font-sans text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

export default function Button({
  variant = 'primary',
  children,
  className = '',
  href,
  type = 'button',
  ...rest
}) {
  const classes = `${baseStyles} ${variantStyles[variant] ?? variantStyles.primary}${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
