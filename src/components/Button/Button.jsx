import React from "react";

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }
  render() {
    const {
      className,
      color,
      borderColor,
      background,
      height,
      width,
      border,
      onClick,
      text,
      disabled,
      strong,
    } = this.props;

    return (
      <div
        className={className}
        style={{
          background: disabled
            ? "#555555"
            : this.state.hover
            ? "#777777"
            : background,
          height: `${height}px`,
          width: `${width}px`,
          borderRadius: "5px",
          border: disabled ? `#444444 solid 2px` : `#111111 solid 2px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: disabled ? null : "pointer",
        }}
        onClick={disabled ? null : () => onClick()}
        onMouseOver={() =>
          this.setState({
            hover: true,
          })
        }
        onMouseLeave={() =>
          this.setState({
            hover: false,
          })
        }
        disabled
      >
        {strong ? <h1>{text}</h1> : <span>{text}</span>}
      </div>
    );
  }
}

// .header-buttons button {
//   background: #333333;
//   height: 40px;
//   width: 120px;
//   margin: 0 0 10px 0;
//   text-align: center;
//   border-radius: 5px;
//   color: white;
//   border: #3f48cc 1px solid;
//   transition: border-radius 0.1s ease-in-out, border 0.1s ease-in-out;
// }
// .header-buttons button:hover,
// .contact-buttons button:not(.funding):hover {
//   cursor: pointer;
//   background: #555555;
//   border: lightblue 2px solid;
//   border-radius: 10px;
//   /* transition: border 0.5s ease-in-out; */
//   transition: border-radius 0.1s ease-in-out, border 0.1s ease-in-out,
//     background 0.1s ease-in-out;
// }
