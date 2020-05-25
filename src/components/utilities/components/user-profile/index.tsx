/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppState } from './logic/reducer';
import { loadUserData, saveUserData, changeUser } from './logic/actions';
import { Navigation } from './navigation';
import Profile from './profile';
import { HeadingLevelTwo, Loader } from 'components/common';
import { BindingAction, BindingCbWithOne, IMember } from 'common/models';
import { IUtilitiesMember } from './types';
import styles from './styles.module.scss';
interface Props {
  isLoading: boolean;
  isLoaded: boolean;
  userData: IMember | IUtilitiesMember | null;
  loadUserData: BindingAction;
  saveUserData: BindingAction;
  changeUser: BindingCbWithOne<Partial<IUtilitiesMember>>;
}

const UserProfile = ({
  isLoading,
  userData,
  loadUserData,
  saveUserData,
  changeUser,
}: Props) => {

  React.useEffect(() => {
    loadUserData();
  }, []);

  if (isLoading || !userData) {
    return <Loader />;
  }

  return (
    <section>
      <form
        onSubmit={evt => {
          evt.preventDefault();
        }}
      >
        <Navigation onSaveUser={saveUserData} />

        <div className={styles.headingWrapper}>
          <HeadingLevelTwo>Utilities</HeadingLevelTwo>
        </div>

        <Profile userData={userData} changeUser={changeUser} />

      </form>
    </section>
  );
};

interface IRootState {
  utilities: AppState;
}

export default connect(
  ({ utilities }: IRootState) => ({
    isLoading: utilities.isLoading,
    isLoaded: utilities.isLoaded,
    userData: utilities.userData,
  }),
  (dispatch: Dispatch) =>
    bindActionCreators(
      {
        loadUserData,
        changeUser,
        saveUserData,
      },
      dispatch
    )
)(UserProfile);
