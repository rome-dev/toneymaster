import React, { useState } from 'react';
import { Button } from 'components/common';
import { DiagnosticTypes } from 'components/schedules/types';
import Diagnostics, { IDiagnosticsInput } from '..';

interface IProps {
  divisionsDiagnostics: IDiagnosticsInput;
}

export default (props: IProps) => {
  const { divisionsDiagnostics } = props;

  const [dianosticsOpen, setDiagnosticsOpen] = useState(false);

  const openDianostics = () => setDiagnosticsOpen(true);
  const closeDiagnostics = () => setDiagnosticsOpen(false);

  return (
    <>
      <Button
        label="Divisions"
        variant="contained"
        color="primary"
        onClick={openDianostics}
      />
      <Diagnostics
        isOpen={dianosticsOpen}
        tableData={divisionsDiagnostics}
        onClose={closeDiagnostics}
        diagnosticType={DiagnosticTypes.DIVISIONS_DIAGNOSTICS}
      />
    </>
  );
};
