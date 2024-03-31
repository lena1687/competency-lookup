import {
  CompetencyData,
  LookupMode,
  LookupSettings,
  SummaryValue,
} from '../../../../types';
import { Dropdown } from '../../../components/forms/Dropdown';
import React, { useState } from 'react';
import { RadioGroup } from '../../../components/forms/RadioGroup';
import { SelectOption } from '../../../components/forms/Dropdown/Dropdown';
import './LookupParameters.css';

const lookupModeOptions = [
  { text: 'Participant', value: LookupMode.PARTICIPANT },
  { text: 'Summary', value: LookupMode.SUMMARY },
];

const summaryOptions = [
  { text: 'Lowest', value: SummaryValue.LOWEST },
  { text: 'Highest', value: SummaryValue.HIGHEST },
  { text: 'Average', value: SummaryValue.AVERAGE },
  { text: 'Type', value: SummaryValue.TYPE },
];

interface Props {
  data: CompetencyData[];
  onSubmit: (output: LookupSettings) => void;
}

export const LookupParameters: React.FC<Props> = ({
  data,
  onSubmit,
}: Props) => {
  const [lookupMode, setLookupMode] = useState<LookupMode | null>(null);
  const [competency, setCompetency] = useState<string | null>(null);
  const [participant, setParticipant] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryValue | null>(null);

  function handleSubmit() {
    if (lookupMode === LookupMode.PARTICIPANT) {
      return onSubmit({
        competency: competency!,
        participant: participant!,
      });
    } else {
      return onSubmit({
        competency: competency!,
        summary: summary!,
      });
    }
  }

  function handleChangeMode(value: LookupMode) {
    setLookupMode(value);
    setParticipant(null);
    setSummary(null);
  }

  return (
    <div className="lookup-parameters">
      <h2>Lookup Parameters</h2>

      <RadioGroup
        name="lookup-mode"
        options={lookupModeOptions}
        onChange={(value) => handleChangeMode(value as LookupMode)}
      />

      <div className="lookup-parameters__content">
        <Dropdown
          options={getCompetencyOptions(data)}
          label="Competency"
          name="competency"
          onOptionSelect={(value) => setCompetency(value as string)}
        />

        {lookupMode === LookupMode.PARTICIPANT && (
          <Dropdown
            options={getParticipantOptions(data)}
            label="Participant"
            name="participant"
            onOptionSelect={(value) => setParticipant(value as string)}
          />
        )}

        {lookupMode === LookupMode.SUMMARY && (
          <Dropdown
            label="Summary"
            options={summaryOptions}
            name="summary"
            onOptionSelect={(value) => setSummary(value as SummaryValue)}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={!lookupMode || !competency || (!participant && !summary)}
        onClick={handleSubmit}
      >
        Lookup
      </button>
    </div>
  );
};

function getCompetencyOptions(data: CompetencyData[]): SelectOption[] {
  const competencies = data.flatMap(({ Participant, ...rest }) =>
    Object.keys(rest),
  );
  const uniqueCompetencies = Array.from(new Set(competencies));
  return uniqueCompetencies.map((competency) => ({
    text: competency,
    value: competency,
  }));
}

function getParticipantOptions(data: CompetencyData[]): SelectOption[] {
  return data.map(({ Participant }) => ({
    text: Participant,
    value: Participant,
  }));
}
