export const levels = ['A', 'B', 'C', 'D'] as const;

export type Level = (typeof levels)[number]; // 'A'|'B'|'C'|'D'

export enum CompetencyTypeValue {
  LEVEL = 'level',
  NUMBER = 'number',
}

export type CompetencyType = number | Level;

export type CompetencyData = Record<string, CompetencyType> & {
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
