export type Level = 'A' | 'B' | 'C' | 'D';

export type CompetencyData = Record<string, Level | number> & {
  Participant: string;
  Total: string | number | null;
};

export type LookupSettings = LookupParticipantSettings | LookupSummarySettings;

export enum LookupMode {
  PARTICIPANT = 'participant',
  SUMMARY = 'summary',
}

export enum SummaryValue {
  LOWEST = 'lowest',
  HIGHEST = 'highest',
  AVERAGE = 'average',
  TYPE = 'type',
}

export interface LookupParticipantSettings {
  competency: string;
  participant: string;
}

export interface LookupSummarySettings {
  competency: string;
  summary: SummaryValue;
}
