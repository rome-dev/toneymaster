// ! If the interface changes, you must change the fields for the enum 'common/enums/_entity_'
export interface IRegistration {
  registration_id: string;
  event_id: string;
  entry_fee: number;
  currency: string;
  entry_deposit_YN: number;
  entry_deposit: number;
  early_bird_discount: number;
  discount_enddate: string;
  specific_time_reg_open_YN: number;
  registration_start: string;
  registration_end: string;
  enable_waitlist_YN: number;

  entry_name_label: string;
  division_name_label: string;
  division_name_requested_YN: number;
  division_name_required_YN: number;
  max_teams_per_division: number;
  max_players_per_division: number;
  min_players_per_roster: number;
  max_players_per_roster: number;
  request_athlete_birthdate: number;
  request_athlete_jersey_number: number;
  request_athlete_email: number;
  disclaimer: string;
  registration_information: string;
  reg_first_name: string;
  reg_last_name: string;
  role: string;
  email_address: string;
  mobile_number: number;
  permission_to_text: number;

  upcharge_fees_on_registrations: number;
  upcharge_fee: number;
  payments_enabled_YN: number;
  checks_accepted_YN: number;
  promo_code: string;
  promo_code_discount: number;
  fees_vary_by_division_YN: number;

  is_published_YN: number;
  is_active_YN: number;
  is_library_YN: 0 | 1 | null;
  created_by: string;
  created_datetime: string;
  updated_by: string;
  updated_datetime: string;
}
