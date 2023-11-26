import React from 'react';

interface ButtonProps {
  className: string;
  color: string;
  height?: number;
  width?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  disabled?: boolean;
  strong?: boolean;
  submit?: boolean;
  fontSize?: number;
  backgroundColorOverride?: string;
  styles?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  text = 'hello test',
  width = 120,
  height = 40,
  disabled = false,
  submit = false,
  backgroundColorOverride = '',
  ...props
}: ButtonProps) => {
  const { className, color, onClick, strong } = props as ButtonProps;

  return (
    <button
      className={`button ${className}-${color}${disabled ? '-disabled' : ''}`}
      style={{
        ...props.styles,
        height: `${height}px`,
        width: `${width}px`,
        fontSize: `${props.fontSize}px`,
        background: `${
          backgroundColorOverride === '' ? '' : backgroundColorOverride
        }`,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={submit ? 'submit' : 'button'}
    >
      {strong ? <strong>{text}</strong> : <span>{text}</span>}
    </button>
  );
};

export default Button;
