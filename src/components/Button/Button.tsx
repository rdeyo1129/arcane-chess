import React from 'react';

interface ButtonProps {
  className: string;
  color: string;
  height?: number | string;
  width?: number | string;
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
        height: `${height}${typeof height === 'string' ? '' : 'px'}`,
        width: `${width}${typeof width === 'string' ? '' : 'px'}`,
        fontSize: `${props.fontSize}px`,
        background: `${
          backgroundColorOverride === '' ? '' : backgroundColorOverride
        }`,
        cursor: "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
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
