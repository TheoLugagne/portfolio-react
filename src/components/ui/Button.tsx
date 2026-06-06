import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';

type ButtonVariant = 'primary' | 'outline';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-dark hover:brightness-95 active:brightness-90',
  outline:
    'border-2 border-dark bg-transparent text-dark hover:bg-dark/5 active:bg-dark/10',
};

const baseStyles =
  'inline-flex items-center justify-center rounded-lg px-8 py-3 font-sans text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

type CommonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
  };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; type?: never };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    children,
    className = '',
    href,
    ...rest
  } = props;

  const classes = `${baseStyles} ${variantStyles[variant]}${className ? ` ${className}` : ''}`;

  if (href) {
    const linkProps = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
    return (
      <a href={href} className={classes} {...linkProps}>
        {children}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
