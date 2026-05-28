import React from 'react';

/**
 * Premium tugma komponenti — glassmorphism dizayn
 * Variantlar: primary, secondary, danger, ghost
 * O'lchamlar: sm, md, lg
 */

/* Spinner animatsiya uchun CSS keyframes */
const spinnerKeyframes = `
@keyframes btn-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes btn-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(108, 92, 231, 0.4); }
  50% { box-shadow: 0 0 30px rgba(108, 92, 231, 0.7); }
}
`;

/* Stil injeksiya qilish (faqat bir marta) */
if (typeof document !== 'undefined') {
  const styleId = 'zor-button-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = spinnerKeyframes;
    document.head.appendChild(styleEl);
  }
}

/* O'lcham sozlamalari */
const sizeMap = {
  sm: { padding: '8px 16px', fontSize: '13px', borderRadius: '10px', minHeight: '34px' },
  md: { padding: '12px 24px', fontSize: '15px', borderRadius: '12px', minHeight: '44px' },
  lg: { padding: '16px 32px', fontSize: '17px', borderRadius: '14px', minHeight: '52px' },
};

/* Variant stillari */
const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, var(--accent, #6c5ce7), var(--accent-secondary, #a855f7))',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(108, 92, 231, 0.4)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--text-primary, #fff)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
  },
  danger: {
    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(231, 76, 60, 0.35)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary, rgba(255,255,255,0.7))',
    border: '1px solid transparent',
    boxShadow: 'none',
  },
};

/* Hover stillari */
const hoverStyles = {
  primary: {
    boxShadow: '0 6px 28px rgba(108, 92, 231, 0.6)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)',
  },
  secondary: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-1px)',
  },
  danger: {
    boxShadow: '0 6px 28px rgba(231, 76, 60, 0.55)',
    transform: 'translateY(-1px)',
    filter: 'brightness(1.1)',
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.06)',
    color: 'var(--text-primary, #fff)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  style: customStyle,
  ...rest
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const isDisabled = disabled || loading;

  /* Asosiy stil */
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    fontWeight: '600',
    letterSpacing: '0.3px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.5 : 1,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    ...sizeMap[size],
    ...variantStyles[variant],
    ...(isHovered && !isDisabled ? hoverStyles[variant] : {}),
    ...(isPressed && !isDisabled ? { transform: 'scale(0.97)', filter: 'brightness(0.95)' } : {}),
    ...customStyle,
  };

  /* Yuklanish spinner stili */
  const spinnerStyle = {
    width: size === 'sm' ? '14px' : size === 'lg' ? '20px' : '16px',
    height: size === 'sm' ? '14px' : size === 'lg' ? '20px' : '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'btn-spin 0.7s linear infinite',
    flexShrink: 0,
  };

  return (
    <button
      style={baseStyle}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      {...rest}
    >
      {loading && <span style={spinnerStyle} />}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
    </button>
  );
};

export default Button;
