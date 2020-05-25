import React from 'react';
import styles from '../styles.module.scss';
import { IRegistration } from 'common/models/registration';
import { Checkbox } from 'components/common';

const Payments = ({ data }: { data: Partial<IRegistration> }) => (
  <div className={styles.section}>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        {data?.upcharge_fees_on_registrations ? (
          <div>
            <span className={styles.sectionTitle}>
              Upcharge Processing Fees
            </span>
            <p>{data.upcharge_fee ? `$${data.upcharge_fee}` : '—'}</p>
          </div>
        ) : (
          <Checkbox
            options={[
              {
                label: 'Upcharge Processing Fees',
                checked: Boolean(
                  data ? data.upcharge_fees_on_registrations : false
                ),
                disabled: true,
              },
            ]}
          />
        )}
      </div>
      <div className={styles.sectionItem}>
        <Checkbox
          options={[
            {
              label: 'Checks Accepted',
              checked: Boolean(data ? data.checks_accepted_YN : false),
              disabled: true,
            },
          ]}
        />
      </div>
      <div className={styles.sectionItem}>
        <div>
          <span className={styles.sectionTitle}>Promo Code</span>
          <p>{data.promo_code ? data.promo_code : '—'}</p>
        </div>
      </div>
      {data.promo_code ? (
        <div className={styles.sectionItem}>
          <span className={styles.sectionTitle}>Promo Code Discount</span>
          <p>
            {data.promo_code_discount ? `${data.promo_code_discount}%` : '—'}
          </p>
        </div>
      ) : (
        <div className={styles.sectionItem} />
      )}
    </div>
  </div>
);

export default Payments;
