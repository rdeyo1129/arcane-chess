import React, { useState } from 'react';
import './Input.scss';

interface InputProps {
  id?: string;
  className: string;
  color: string;
  height?: number;
  width?: number;
  placeholder?: string;
  value?: string;
  text?: string;
  setText: (text: string) => void;
}

const Input: React.FC<InputProps> = ({
  placeholder = 'Type here...',
  width = 120,
  height = 40,
  ...props
}: InputProps) => {
  const { id, className, color, value, text, setText } = props as InputProps;
  // const [text, setText] = useState('');

  // type : password?
  // size : # of characters?

  return (
    <input
      id={id}
      className={`${className}`}
      type="text"
      style={{
        height: `${height}px`,
        width: `${width}px`,
        // color: `${color}`, ROYGBV
      }}
      placeholder={placeholder}
      value={text}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        setText(e.target.value)
      }
    />
  );
};

export default Input;
