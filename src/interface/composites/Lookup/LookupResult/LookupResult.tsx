import {
  CompetencyData,
  CompetencyType,
  CompetencyTypeValue,
  Level,
  levels,
  LookupParticipantSettings,
  LookupSettings,
  LookupSummarySettings,
  SummaryValue,
} from '../../../../types';
import React from 'react';
import './LookupResult.css';

const levelToNumberMap: Record<Level, number> = {
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

const numberToLevelMap = Object.fromEntries(
  Object.entries(levelToNumberMap).map(([k, v]) => [v, k]),
);

interface Props {
  data: CompetencyData[];
  parameters: LookupSettings;
}

export const LookupResult: React.FC<Props> = ({ data, parameters }: Props) => {
  return (
    <div className="lookup-result">
      {isLookupParticipantSettings(parameters)
        ? getCompetencyForParticipant(data, parameters)
        : getCompetencyForSummary(data, parameters)}
    </div>
  );
};

function isLookupParticipantSettings(
  parameters: LookupSettings,
): parameters is LookupParticipantSettings {
  return 'participant' in parameters;
}

function getCompetencyForParticipant(
  data: CompetencyData[],
  { competency, participant }: LookupParticipantSettings,
) {
  const competencyData = data.find((item) => item.Participant === participant)!;
  const competencyValue = competencyData[competency];

  if (competencyValue) {
    return `${participant} scored ${competencyValue} on ${competency}`;
  }
  return `${participant} has no score for ${competency}`;
}

// calculation for summary results
function getCompetencyForSummary(
  data: CompetencyData[],
  { summary, competency }: LookupSummarySettings,
) {
  switch (summary) {
    case SummaryValue.TYPE:
      return getTypeOfCompetencyText(data, competency);
    case SummaryValue.AVERAGE:
      return getAverageOfCompetencyText(data, competency);
    case SummaryValue.LOWEST:
      return getLowestOfCompetencyText(data, competency);
    case SummaryValue.HIGHEST:
      return getHighestOfCompetencyText(data, competency);
    default:
      return 'Not implemented yet';
  }
}

function getTypeOfCompetencyText(data: CompetencyData[], competency: string) {
  return `The type of ${competency} is '${getTypeOfCompetency(data, competency)}'`;
}

function getAverageOfCompetencyText(
  data: CompetencyData[],
  competency: string,
) {
  const competencyNumbers = getCompetencyNumbers(data, competency);
  const sum = competencyNumbers.reduce((acc, item) => item + acc, 0);
  const averageValue = sum / competencyNumbers.length;
  return `The average score for ${competency} is ${formatNumberOfType(averageValue, getTypeOfCompetency(data, competency))}`;
}

function getLowestOfCompetencyText(data: CompetencyData[], competency: string) {
  const competencyNumbers = getCompetencyNumbers(data, competency);
  const type = getTypeOfCompetency(data, competency);
  return `The lowest score for ${competency} is ${formatNumberOfType(Math.min(...competencyNumbers), type)}`;
}

function getHighestOfCompetencyText(
  data: CompetencyData[],
  competency: string,
) {
  const competencyNumbers = getCompetencyNumbers(data, competency);
  const type = getTypeOfCompetency(data, competency);
  return `The highest score for ${competency} is ${formatNumberOfType(Math.max(...competencyNumbers), type)}`;
}

function getTypeOfCompetency(data: CompetencyData[], competency: string) {
  const competencyData = data.find((item) => item[competency])!;
  const competencyValue = competencyData[competency];
  return getTypeOfValue(competencyValue);
}

function getTypeOfValue(value: CompetencyType): CompetencyTypeValue {
  return levels.includes(value as Level)
    ? CompetencyTypeValue.LEVEL
    : CompetencyTypeValue.NUMBER;
}

function getCompetencyNumbers(data: CompetencyData[], competency: string) {
  return data
    .filter((item) => item[competency])
    .map((item) => mapValueToNumber(item[competency]));
}

function mapValueToNumber(value: CompetencyType) {
  return isLevel(value) ? levelToNumberMap[value] : Number(value);
}

function isLevel(value: CompetencyType): value is Level {
  return getTypeOfValue(value) === CompetencyTypeValue.LEVEL;
}

function formatNumberOfType(value: number, type: CompetencyTypeValue) {
  return type === CompetencyTypeValue.LEVEL
    ? numberToLevelMap[Math.floor(value)]
    : value.toFixed(1);
}
