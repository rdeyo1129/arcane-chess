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
//   transition: border-radius 0.2s ease-in, border 0.2s ease-in;
//   font-family: "Exo", exo;
// }
// .header-buttons button:hover,
// .contact-buttons button:not(.funding):hover {
//   cursor: pointer;
//   background: #555555;
//   border: lightblue 2px solid;
//   border-radius: 15px;
//   /* transition: border 0.5s ease-in; */
//   transition: border-radius 0.2s ease-in, border 0.2s ease-in,
//     background 0.2s ease-in;
// }

// .header-buttons .primary-button {
//   /* background: #303796; */
//   background: #3f48cc;
// }
// .header-buttons .primary-button:hover {
//   background: #3f48cc;
// }

// .header-buttons .tertiary-button {
//   background: #333333;
//   border: none;
//   border-radius: 0;
//   transition: background 0.2s ease-in;
// }
// .header-buttons .tertiary-button:hover {
//   background: #555555;
//   border: none;
//   border-radius: 0;
//   transition: background 0.2s ease-in;
// }

// notes
// inline styling for button width and height?
// inline styling for tertiary button border radius and transition?
// inline styling for color?
// default sizings for all buttons?
