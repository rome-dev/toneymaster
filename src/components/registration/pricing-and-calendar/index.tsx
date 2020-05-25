import React from 'react';
import { Checkbox } from 'components/common';
import styles from '../styles.module.scss';
import moment from 'moment';
import { HashLink } from 'react-router-hash-link';
import { IRegistration } from 'common/models/registration';
import { stringToLink } from 'helpers';

interface IPricingAndCalendarProps {
  data: Partial<IRegistration>;
  divisions: { name: string; id: string }[];
  eventId: string;
}

const PricingAndCalendar = ({
  data,
  divisions,
  eventId,
}: IPricingAndCalendarProps) => (
  <div className={styles.section}>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Divisions</span>
        <div>
          {divisions.map((division, index: number) => (
            <HashLink
              key={division.id}
              className={styles.link}
              to={`/event/divisions-and-pools/${eventId}#${stringToLink(
                division.name
              )}`}
            >
              <span>{`${division.name}${
                index === divisions.length - 1 ? '' : ', '
              }`}</span>
            </HashLink>
          ))}
        </div>
      </div>
      <div className={styles.sectionItem} />
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Open Date</span>
        <p>
          {(data.registration_start &&
            moment(data.registration_start).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Close Date</span>
        <p>
          {(data.registration_end &&
            moment(data.registration_end).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
    </div>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Entry Fee</span>
        <p>{data.entry_fee ? `$${data.entry_fee}` : '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Currency</span>
        <p>{data.currency ? data.currency : '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Early Bird Discount</span>
        <p>{data.early_bird_discount ? `$${data.early_bird_discount}` : '—'}</p>
      </div>
      <div className={styles.sectionItem}>
        <span className={styles.sectionTitle}>Discount End Date</span>
        <p>
          {(data.discount_enddate &&
            moment(data.discount_enddate).format('MM-DD-YYYY')) ||
            '—'}
        </p>
      </div>
    </div>
    <div className={styles.sectionRow}>
      <div className={styles.sectionItem}>
        {data?.entry_deposit_YN ? (
          <div>
            <span className={styles.sectionTitle}>Deposit Fee</span>
            <p>{data.entry_deposit ? `$${data.entry_deposit}` : '—'}</p>
          </div>
        ) : (
          <Checkbox
            options={[
              {
                label: 'Entry Deposit Enabled',
                checked: Boolean(data ? data.entry_deposit_YN : false),
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
              label: 'Division Fees Vary',
              checked: Boolean(data ? data.fees_vary_by_division_YN : false),
              disabled: true,
            },
          ]}
        />
      </div>
      <div className={styles.sectionItem}>
        <Checkbox
          options={[
            {
              label: 'Opens at a specific time',
              checked: Boolean(data ? data.specific_time_reg_open_YN : false),
              disabled: true,
            },
          ]}
        />
      </div>
      <div className={styles.sectionItem}>
        <Checkbox
          options={[
            {
              label: 'Enable waitlist',
              checked: Boolean(data ? data.enable_waitlist_YN : false),
              disabled: true,
            },
          ]}
        />
      </div>
    </div>
  </div>
);

export default PricingAndCalendar;
