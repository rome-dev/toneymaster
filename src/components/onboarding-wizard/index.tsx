import React from 'react';
import { connect } from 'react-redux';
import { Modal, Radio, Button, HeadingLevelTwo } from 'components/common';
import styles from './styles.module.scss';
import CreateOrganization from 'components/organizations-management/components/create-organization';
import ApplyInvitation from 'components/organizations-management/components/apply-invitation';
import { BindingCbWithOne, IConfigurableOrganization } from 'common/models';
import {
  createOrganization,
  addUserToOrganization,
} from 'components/organizations-management/logic/actions';
import { Routes } from 'common/enums';
import history from 'browserhistory';

type InputTargetValue = React.ChangeEvent<HTMLInputElement>;

interface Props {
  isOpen: boolean;
  createOrganization: BindingCbWithOne<IConfigurableOrganization>;
  addUserToOrganization: BindingCbWithOne<string>;
}

enum TypeOptions {
  'Create New' = 1,
  'Join Existing' = 2,
}

const typeOptions = ['Create New', 'Join Existing'];

class OnboardingWizard extends React.Component<Props> {
  state = { step: 1, type: 1 };

  onTypeChange = (e: InputTargetValue) =>
    this.setState({ type: TypeOptions[e.target.value] });

  onNextStep = () => {
    this.setState({ step: 2 });
  };

  onPreviousStep = () => {
    this.setState({ step: 1 });
  };

  renderStepOne = () => {
    return (
      <div style={{ height: '185px' }}>
        <p className={styles.message}>
          Would you like to create an Organization or join existing one?
        </p>
        <div className={styles.radioBtnsWrapper}>
          <Radio
            options={typeOptions}
            formLabel=""
            onChange={this.onTypeChange}
            checked={TypeOptions[this.state.type] || ''}
          />
        </div>
        <div className={styles.btnWrapper}>
          <Button
            label="Next"
            color="primary"
            variant="contained"
            onClick={this.onNextStep}
          />
        </div>
      </div>
    );
  };

  renderStepTwo = (type: number) => {
    switch (type) {
      case 1:
        return (
          <div style={{ height: '425px' }}>
            <CreateOrganization
              type="wizard"
              createOrganization={this.props.createOrganization}
              onCancelBtn={this.onPreviousStep}
              isSectionExpand={true}
            />
          </div>
        );
      case 2:
        return (
          <div style={{ height: '310px' }}>
            <ApplyInvitation
              type="wizard"
              addUserToOrganization={this.props.addUserToOrganization}
              onCancel={this.onPreviousStep}
              isSectionExpand={true}
            />
          </div>
        );
    }
  };

  renderWizard = (step: number) => {
    switch (step) {
      case 1:
        return this.renderStepOne();
      case 2:
        return this.renderStepTwo(this.state.type);
      default:
        return this.renderStepOne();
    }
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClose={() => {}}>
        <div className={styles.container}>
          <div className={styles.headerWrapper}>
            <HeadingLevelTwo>Onboarding Wizard</HeadingLevelTwo>
            <Button
              label="Sign Out"
              color="secondary"
              variant="text"
              onClick={() => {
                localStorage.clear();
                history.replace(Routes.LOGIN);
              }}
            />
          </div>
          {this.renderWizard(this.state.step)}
        </div>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  createOrganization,
  addUserToOrganization,
};

export default connect(null, mapDispatchToProps)(OnboardingWizard);
