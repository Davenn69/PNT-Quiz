const UNIT_QUESTION_TYPE_BASE = {
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
} as const;

export type UNIT_QUESTION_TYPE =
  (typeof UNIT_QUESTION_TYPE_BASE)[keyof typeof UNIT_QUESTION_TYPE_BASE];
