import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LOADER_DEFAULT_STYLES = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '15px',
};

interface Props {
  styles?: object;
}

const Loader = ({ styles }: Props) => (
  <div style={{ ...LOADER_DEFAULT_STYLES, ...styles }}>
    <CircularProgress />
  </div>
);

export default Loader;
