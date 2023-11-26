import React from 'react';

import './Select.scss';

interface SelectProps {
  type: string;
  title?: string;
  options: number[] | string[];
  onChange: (val: boolean | string | number | null) => void;
  width?: number | string;
  height?: number | string;
}
interface SelectState {
  selectedValue: string | number | boolean | null;
}

class Select extends React.Component<SelectProps, SelectState> {
  constructor(props: SelectProps) {
    super(props);
    this.state = {
      selectedValue:
        props.type === 'string' ? '' : props.type === 'number' ? 0 : false,
    };
  }

  onChangeUses = (value: boolean | string | number | null) => {
    this.setState({ selectedValue: value });
    this.props.onChange(value);
  };

  render() {
    const { width, height } = this.props;
    return (
      <div className="select-container">
        <span className="select-title">{this.props.title}</span>
        <select
          className="dropdown"
          style={{
            width: width ? width : '100%',
            height: height ? height : '100%',
          }}
          onChange={(e) => {
            this.onChangeUses(e.target.value);
          }}
        >
          {this.props.options.map((option, i) => {
            return (
              <option key={i} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

export default Select;
