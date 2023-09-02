import { useState } from "react";
import "./Toggle.scss";

// function Toggle({}) {
//   const [isChecked, setIsChecked] = useState(false);

//   const toggleSwitch = () => {
//     setIsChecked(!isChecked);
//   };

//   return (
//     <label className="switch">
//       <input type="checkbox" />
//       <span className="slider"></span>
//     </label>
//   );
// }

// finish the above component with custom inline styles for height and width, default params for labels, on and off text, and a callback function for when the toggle is switched, and a default param for the initial state of the toggle, also include the on and off texts on either side and outside of the toggle

// function Toggle({
//   height = 30,
//   width = 60,
//   onText = "ON",
//   offText = "OFF",
//   callback = () => console.log("toggled"),
//   initialState = false,
// }: {
//   height?: number;
//   width?: number;
//   onText?: string;
//   offText?: string;
//   callback?: () => void;
//   initialState?: boolean;
// }) {
//   const [isChecked, setIsChecked] = useState(initialState);

//   const toggleSwitch = () => {
//     setIsChecked(!isChecked);
//     callback();
//   };

//   return (
//     <div className="toggle">
//       <div className="on-text">{onText}</div>
//       <label
//         className="switch"
//         style={{ height: `${height}px`, width: `${width}px` }}
//       >
//         <input type="checkbox" onChange={toggleSwitch} />
//         <span className="slider"></span>
//         {/* <span className="on-text">{onText}</span>
//         <span className="off-text">{offText}</span> */}
//       </label>
//       <div className="off-text">{offText}</div>
//     </div>
//   );
// }

export default Toggle;

// write the same function but make the on-text and off-text that is currently selected lighter / hightlighted

function Toggle({
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
}) {
  const [isChecked, setIsChecked] = useState(initialState);

  const toggleSwitch = () => {
    setIsChecked(!isChecked);
    callback();
  };

  return (
    <div className="toggle">
      <div
        className="toggle-text"
        style={isChecked ? { color: "white" } : { opacity: 0 }}
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
        style={isChecked ? { opacity: 0 } : { color: "white" }}
      >
        {onText}
      </div>
    </div>
  );
}

//
