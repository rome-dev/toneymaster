export interface ISchedulesDetails {
  schedule_version_id: string;
  schedule_version_desc: string | null;
  schedule_id: string;
  schedule_desc: string | null;
  event_id: string | null;
  division_id: string | null;
  pool_id: string | null;
  game_id: number | string;
  game_date: string | null;
  game_time: string | null;
  field_id: string | null;
  away_team_id: string | null;
  home_team_id: string | null;
  game_locked_YN: 1 | 0 | null;
  away_team_locked: 1 | 0 | null;
  home_team_locked: 1 | 0 | null;
  is_draft_YN: 1 | 0 | null;
  is_published_YN: 1 | 0 | null;
  created_by: string | null;
  created_datetime: string;
  updated_by: string | null;
  updated_datetime: string | null;
}
