import React from 'react';
import { ITeamWithResults, IScoringSetting } from 'common/models';
import styles from './styles.module.scss';

interface Props {
  team: ITeamWithResults;
  divisionName: string;
  poolName: string;
  scoringSettings: IScoringSetting;
  onOpenTeamDetails: (
    team: ITeamWithResults,
    divisionName: string,
    poolName: string
  ) => void;
}

const TeamItem = ({
  team,
  divisionName,
  poolName,
  onOpenTeamDetails,
  scoringSettings,
}: Props) => (
  <tr>
    <td>
      <button
      className={styles.teamBtn}
        onClick={() => onOpenTeamDetails(team, divisionName, poolName)}
        aria-label={`Press to show more about ${team.long_name} team"`}
      >
        {team.short_name}
      </button>
    </td>
    <td>{team.wins}</td>
    <td>{team.losses}</td>
    {scoringSettings.hasTies && <td>{team.tie}</td>}
    {scoringSettings.hasGoalsScored && <td>{team.goalsScored}</td>}
    {scoringSettings.hasGoalsAllowed && <td>{team.goalsAllowed}</td>}
    {scoringSettings.hasGoalsDifferential && <td>{team.goalsDifferential}</td>}
  </tr>
);

export default TeamItem;
