import React from 'react';

interface ButtonProps {
  className: string;
  color: string;
  height?: number;
  width?: number;
  onClick: () => void;
  text: string;
  disabled: boolean;
  strong?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text = 'hello test',
  width = 120,
  height = 40,
  ...props
}: ButtonProps) => {
  const { className, color, onClick, disabled, strong } = props as ButtonProps;

  return (
    <button
      className={`${className}-${color}${disabled ? '-disabled' : ''}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {strong ? <strong>{text}</strong> : <span>{text}</span>}
    </button>
  );
};

export default Button;
