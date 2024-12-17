import { UNIT_QUESTION_TYPE } from 'src/enums';

export interface UnitQuestionResponseDTO {
  id: string;
  type: UNIT_QUESTION_TYPE;
  questionOrder: number;
}

export interface UnitQuestionImageResponseDTO extends UnitQuestionResponseDTO {
  questionImage: string;
  questionAnswer: string;
}

export interface UnitQuestionTextResponseDTO extends UnitQuestionResponseDTO {
  questionText: string;
}
