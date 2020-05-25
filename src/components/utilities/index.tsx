import React from 'react';
import { Location } from 'common/models';
import UserProfile from './components/user-profile';
import TourneyImportWizard from './components/tourney-import';

interface Props {
  location: Location;
}

const Utilities = ({ location }: Props) => {
  return (
    location.hash === '#user-profile' ?
      <UserProfile /> : <TourneyImportWizard />
  );
};

export default Utilities;
