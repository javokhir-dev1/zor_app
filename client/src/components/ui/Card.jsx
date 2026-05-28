import React from 'react';

/**
 * Glassmorphism karta komponenti
 * Shisha effekti + hover animatsiya
 * animated=true bo'lsa, fadeIn animatsiya index asosida kechiktiriladi
 */

/* Animatsiya keyframes */
const cardKeyframes = `
@keyframes card-fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
`;

if (typeof document !== 'undefined') {
  const styleId = 'zor-card-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = cardKeyframes;
    document.head.appendChild(styleEl);
  }
}

const Card = ({
  children,
  className = '',
  onClick,
  animated = false,
  index = 0,
  style: customStyle,
  ...rest
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle = {
    background: 'var(--bg-card, rgba(255, 255, 255, 0.05))',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',

    /* Animatsiya sozlamalari */
    ...(animated
      ? {
          animation: `card-fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
          animationDelay: `${index * 0.08}s`,
          opacity: 0,
        }
      : {}),

    /* Hover effekti — ko'tarilish + border yoritish */
    ...(isHovered
      ? {
          transform: 'translateY(-3px)',
          border: '1px solid rgba(108, 92, 231, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(108, 92, 231, 0.1)',
        }
      : {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }),

    ...customStyle,
  };

  return (
    <div
      style={baseStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
