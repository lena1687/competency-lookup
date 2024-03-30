import {
  CompetencyData,
  Level,
  LookupParticipantSettings,
  LookupSettings,
  LookupSummarySettings,
  SummaryValue,
} from '../../../../types';
import React from 'react';
import './LookupResult.css';

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

function getTypeOfValue(value: number | Level) {
  return isNaN(parseInt(value as string)) ? 'level' : 'number';
}

function getTypeOfCompetency(data: CompetencyData[], competency: string) {
  const competencyData = data.find((item) => item[competency])!;
  const competencyValue = competencyData[competency];
  return getTypeOfValue(competencyValue);
}

function getTypeOfCompetencyText(data: CompetencyData[], competency: string) {
  return `The type of ${competency} is '${getTypeOfCompetency(data, competency)}'`;
}

function getAverageOfCompetencyText(
  data: CompetencyData[],
  competency: string,
) {
  const filteredData = data.filter((item) => item[competency]);
  const sum = filteredData.reduce((acc, item) => {
    const competencyValue = item[competency];
    return getNumberOfValue(competencyValue) + acc;
  }, 0);
  const averageValue = sum / filteredData.length;
  return `The average score for ${competency} is ${numberToType(averageValue, getTypeOfCompetency(data, competency))}`;
}

function numberToType(value: number, type: 'level' | 'number') {
  return type === 'level'
    ? String.fromCharCode(Math.ceil(value))
    : value.toFixed(1);
}

function isLevel(value: number | Level): value is Level {
  return getTypeOfValue(value) === 'level';
}

function getNumberOfValue(value: number | Level) {
  return isLevel(value) ? value.charCodeAt(0) : value;
}

function getLowestOfCompetencyText(data: CompetencyData[], competency: string) {
  const filteredData = data
    .filter((item) => item[competency])
    .map((item) => getNumberOfValue(item[competency]));
  const type = getTypeOfCompetency(data, competency);
  const lowestValue =
    type === 'level' ? Math.max(...filteredData) : Math.min(...filteredData);
  return `The lowest score for ${competency} is ${numberToType(lowestValue, getTypeOfCompetency(data, competency))}`;
}

function getHighestOfCompetencyText(
  data: CompetencyData[],
  competency: string,
) {
  const filteredData = data
    .filter((item) => item[competency])
    .map((item) => getNumberOfValue(item[competency]));
  const type = getTypeOfCompetency(data, competency);
  const lowestValue =
    type === 'level' ? Math.min(...filteredData) : Math.max(...filteredData);
  return `The highest score for ${competency} is ${numberToType(lowestValue, getTypeOfCompetency(data, competency))}`;
}
