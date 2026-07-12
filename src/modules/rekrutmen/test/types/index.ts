// =====================================================
// ENUMS
// =====================================================

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ESSAY = 'ESSAY',
  AUDIO = 'AUDIO',
}

export enum AttemptStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

// =====================================================
// DOMAIN ENTITIES
// =====================================================

export interface Test {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  test_id: string;

  question_type: QuestionType;

  question_text: string | null;

  question_image: string | null;

  answer_audio: string | null;

  answer_key: string | null;

  score: number;

  sort_order: number;

  is_active: boolean;

  created_at: Date;

  updated_at: Date;
}

export interface QuestionOption {
  id: string;
  question_id: string;

  option_text: string | null;

  option_image: string | null;

  is_correct: boolean;

  created_at: Date;

  updated_at: Date;
}

export interface TestAttempt {
  id: string;

  candidate_id: string;

  test_id: string;

  started_at: Date;

  finished_at: Date | null;

  status: AttemptStatus;
}

export interface TestAnswer {
  id: string;

  attempt_id: string;

  question_id: string;

  selected_option_id: string | null;

  answer_text: string | null;

  answer_image: string | null;

  answer_audio: string | null;

  score: number | null;

  created_at: Date;
}

export interface TestScore {
  id: string;

  attempt_id: string;

  multiple_choice_score: number;

  essay_score: number;

  audio_score: number;

  total_score: number;

  passed: boolean | null;

  created_at: Date;
}

// =====================================================
// ASSIGNMENT
// =====================================================

export interface CandidateTestAssignment {
  id: string;

  candidate_id: number;

  test_id: string;

  message_id: number | null;

  status: AssignmentStatus;

  assigned_at: Date;
}

// =====================================================
// DTOs
// =====================================================

export interface CreateTestDTO {
  title: string;

  description?: string;

  duration_minutes: number;

  is_active?: boolean;
}

export interface UpdateTestDTO
  extends Partial<CreateTestDTO> {}

// =====================================================
// OPTIONS
// =====================================================

export interface CreateOptionDTO {
  question_id?: string;

  option_text?: string;

  option_image?: string | null;

  is_correct: boolean;
}

export interface UpdateOptionDTO
  extends Partial<CreateOptionDTO> {}

// =====================================================
// QUESTIONS
// =====================================================

export interface CreateQuestionDTO {
  test_id: string;

  question_type: QuestionType;

  question_text?: string;

  question_image?: string | null;

  answer_audio?: string | null;

  answer_key?: string;

  score: number;

  sort_order?: number;

  is_active?: boolean;

  options?: CreateOptionDTO[];
}

export interface UpdateQuestionDTO
  extends Partial<
    Omit<
      CreateQuestionDTO,
      'test_id'
    >
  > {
  answer_audio?: string | null;
}

// =====================================================
// ATTEMPTS
// =====================================================

export interface StartAttemptDTO {
  test_id: string;
}

export interface SubmitAttemptDTO {
  attempt_id: string;
}

// =====================================================
// ANSWERS
// =====================================================

export interface AnswerQuestionDTO {
  attempt_id: string;

  question_id: string;

  selected_option_id?: string;

  answer_text?: string;

  answer_image?: string;

  answer_audio?: string;
}

export interface AnswerAudioDTO {
  attempt_id: string;

  question_id: string;
}

// =====================================================
// ASSIGNMENT DTOs
// =====================================================

export interface AssignTestDTO {
  candidate_id: number;

  test_id: string;

  message_id?: number | null;
}

export interface UpdateAssignmentStatusDTO {
  status: AssignmentStatus;
}
export interface TestScore {
  id: string;
  attempt_id: string;
  multiple_choice_score: number;
  essay_score: number;
  audio_score: number;
  total_score: number;
  passed: boolean | null;
  created_at: Date;
}

export interface AttemptWithTest extends TestAttempt {
  test_title: string;
  test_description: string;
  duration_minutes: number;
}