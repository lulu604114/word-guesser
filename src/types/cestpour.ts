export interface CestPourItem {
  id: string;
  object_name: string;    // e.g. "Un couteau"
  image_url: string;
  correct_answer: string; // e.g. "couper"
  wrong_answer: string;   // e.g. "dessiner"
  order_index: number;
  created_at?: string;
}

export type CestPourAnswersMap = Record<string, string>; // item_id → selected word
