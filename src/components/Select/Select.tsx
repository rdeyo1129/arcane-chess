import React from 'react';

import './Select.scss';

interface SelectProps {
  type?: string;
  title?: string;
  options: (string | number)[];
  onChange: (val: string) => void;
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
      selectedValue: props.options.length > 0 ? props.options[0] : '',
    };
  }
  onChangeUses = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
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
          onChange={this.onChangeUses}
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