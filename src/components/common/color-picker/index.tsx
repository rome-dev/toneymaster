import React from 'react';
import { TwitterPicker } from 'react-color';
import {
  BindingAction,
  BindingCbWithOne,
} from '../../../common/models/callback';
import withSelectColor from './hocs/withSelectColor';
import styles from './styles.module.scss';

export interface Props {
  value: string;
  displayColorPicker: boolean;
  onClick: () => void;
  onChange: BindingAction | BindingCbWithOne<{ hex: string }>;
}

const ColorPicker = ({
  value,
  onChange,
  displayColorPicker,
  onClick,
}: Props) => {
  const colors = [
    '#1C315F',
    '#00A259',
    '#C9CACA',
    '#0081B9',
    '#8B8B8C',
    '#DFE3EE',
    '#F7F7F7',
    '#FFFFFF',
  ];

  return (
    <div className={styles.ColorPickerWrapper}>
      <button
        className={styles.ColorPickerBtn}
        style={{ backgroundColor: `#${value}` }}
        onClick={onClick}
      >
        <span className="visually-hidden">Select Color</span>
      </button>
      <div className={styles.ColorPicker}>
        {displayColorPicker && (
          <TwitterPicker
            colors={colors}
            width={'170px'}
            onChangeComplete={onChange}
            triangle={'hide'}
          />
        )}
      </div>
    </div>
  );
};

export default withSelectColor(ColorPicker);
