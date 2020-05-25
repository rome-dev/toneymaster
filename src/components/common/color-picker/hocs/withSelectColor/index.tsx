import React from 'react';
import { Props } from '../../';

interface State {
  activeColor: string;
  displayColorPicker: boolean;
}

const withSelectColor = (Component: React.ComponentType<Props>) => {
  return class WithSelectColor extends React.Component<any, State> {
    constructor(props: {}) {
      super(props);

      this.state = {
        activeColor: '1C315F',
        displayColorPicker: false,
      };
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.value !== this.props.value)
        this.setState({ activeColor: this.props.value });
    }

    onClick = () => {
      this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    _changeHandler = ({ hex }: any) => {
      this.setState({
        displayColorPicker: !this.state.displayColorPicker,
        activeColor: hex,
      });
      this.props.onChange(hex);
    };

    render() {
      const { activeColor, displayColorPicker } = this.state;
      return (
        <Component
          {...this.props}
          value={activeColor}
          displayColorPicker={displayColorPicker}
          onClick={this.onClick}
          onChange={this._changeHandler}
        />
      );
    }
  };
};

export default withSelectColor;
