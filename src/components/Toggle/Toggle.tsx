import React, { useState } from "react";
import "./Toggle.scss";

const Toggle: React.FC = ({
  height = 30,
  width = 60,
  onText = "ON",
  offText = "OFF",
  callback = () => console.log("toggled"),
  initialState = false,
}: {
  height?: number;
  width?: number;
  onText?: string;
  offText?: string;
  callback?: () => void;
  initialState?: boolean;
}) => {
  const [isChecked, setIsChecked] = useState(initialState);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
    callback();
  };

  return (
    <div className="toggle">
      <div
        className="toggle-text"
        style={isChecked ? { opacity: 0 } : { color: "white" }}
      >
        {offText}
      </div>
      <label
        className="switch"
        style={{ height: `${height}px`, width: `${width}px` }}
      >
        <input type="checkbox" onChange={toggleSwitch} />
        <span className="slider"></span>
        {/* <span className="on-text">{onText}</span>
        <span className="off-text">{offText}</span> */}
      </label>

      <div
        className="toggle-text"
        style={isChecked ? { color: "white" } : { opacity: 0 }}
      >
        {onText}
      </div>
    </div>
  );
};

export default Toggle;
