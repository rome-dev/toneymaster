export interface IPlayoffGame {
  game_id: string;
  bracket_id: string;
  event_id: string;
  division_id: string;
  bracket_year: string | null;
  grid_num: number;
  round_num: number;
  field_id: string | null;
  game_date: Date | string;
  game_num: number;
  start_time: string | null;
  away_depends_upon: number | null;
  home_depends_upon: number | null;
  seed_num_away: number | null;
  seed_num_home: number | null;
  away_team_id: string | null;
  home_team_id: string | null;
  away_team_score: number | null;
  home_team_score: number | null;
  is_active_YN: 1 | 0;
  created_by: string;
  created_datetime: string;
  updated_by: string | null;
  updated_datetime: string | null;
}
