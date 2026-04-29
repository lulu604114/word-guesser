// Types for the CEB Interactif module

export type QuestionType = 'qcm' | 'multiple' | 'vrai_faux' | 'ouverte' | 'fermee';

export interface CebOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface CebQuestion {
  id: string;
  text_id: string;
  order_index: number;
  type: QuestionType;
  question_text: string;
  draft_answer: string;
  options: CebOption[];
}

export interface CebText {
  id: string;
  title: string;
  level: 'court' | 'moyen' | 'long';
  content: string;
  created_at?: string;
  questions?: CebQuestion[];
}

// Answer types per question type
// - qcm: single option id
// - multiple: array of option ids
// - vrai_faux: 'vrai' | 'faux'
// - ouverte: string (free text)
// - fermee: 'oui' | 'non'
export type UserAnswer =
  | { type: 'qcm'; value: string }
  | { type: 'multiple'; value: string[] }
  | { type: 'vrai_faux'; value: 'vrai' | 'faux' }
  | { type: 'ouverte'; value: string }
  | { type: 'fermee'; value: 'oui' | 'non' };

export type AnswersMap = Record<string, UserAnswer>;
