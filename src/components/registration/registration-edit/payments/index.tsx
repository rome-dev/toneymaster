import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration, BindingCbWithTwo } from 'common/models';
import { Checkbox, Input } from 'components/common';

interface IPaymentsProps {
  data?: IRegistration;
  onChange: BindingCbWithTwo<string, string | number>;
}

const Payments = ({ data, onChange }: IPaymentsProps) => {
  const onUpchargeProcessingFeesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => onChange('upcharge_fees_on_registrations', Number(e.target.checked));

  const onUpchargeFeeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('upcharge_fee', e.target.value);

  const onPromocodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code', e.target.value);

  const onPromocodeDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('promo_code_discount', e.target.value);

  const onCheckAcceptedChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange('checks_accepted_YN', Number(e.target.checked));

  return (
    <div className={styles.section}>
      <div className={styles.sectionRow}>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onUpchargeProcessingFeesChange}
            options={[
              {
                label: 'Upcharge Processing Fees',
                checked: Boolean(
                  data ? data.upcharge_fees_on_registrations : false
                ),
              },
            ]}
          />
          {data?.upcharge_fees_on_registrations ? (
            <Input
              fullWidth={true}
              startAdornment="%"
              type="number"
              value={data ? data.upcharge_fee : ''}
              onChange={onUpchargeFeeChange}
            />
          ) : null}
        </div>
        <div className={styles.sectionItem}>
          <Checkbox
            onChange={onCheckAcceptedChange}
            options={[
              {
                label: 'Checks Accepted',
                checked: Boolean(data ? data.checks_accepted_YN : false),
              },
            ]}
          />
        </div>
        <div className={styles.sectionItem}>
          <Input
            fullWidth={true}
            label="Promo Code"
            value={data ? data.promo_code : ''}
            onChange={onPromocodeChange}
          />
        </div>
        {data?.promo_code ? (
          <div className={styles.sectionItem}>
            <Input
              fullWidth={true}
              startAdornment="%"
              label="Promo Code Discount"
              type="number"
              value={data ? data.promo_code_discount : ''}
              onChange={onPromocodeDiscountChange}
            />
          </div>
        ) : (
          <div className={styles.sectionItem} />
        )}
      </div>
    </div>
  );
};

export default Payments;
