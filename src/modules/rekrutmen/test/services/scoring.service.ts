import pool from '../../../../config/db';
import { TestScore } from '../types';

export class ScoringService {
  async calculateAndSaveScores(attemptId: string, client?: any): Promise<TestScore> {
    const db = client || pool;

    // Fetch all answers for this attempt
    const answers = await db.query(
      `SELECT ta.*, q.question_type, q.score as question_max_score
       FROM test_answers ta
       JOIN questions q ON ta.question_id = q.id
       WHERE ta.attempt_id = $1`,
      [attemptId]
    );

    let multipleChoiceScore = 0;
    let essayScore = 0;
    let audioScore = 0;

    for (const ans of answers.rows) {
      if (ans.question_type === 'MULTIPLE_CHOICE') {
        // Auto-score: compare selected_option_id with correct options
        if (ans.selected_option_id) {
          const correct = await db.query(
            'SELECT id FROM question_options WHERE question_id = $1 AND is_correct = true',
            [ans.question_id]
          );
          const correctIds = correct.rows.map((r: any) => r.id);
          if (correctIds.includes(ans.selected_option_id)) {
            multipleChoiceScore += ans.question_max_score;
            // Update answer score
            await db.query('UPDATE test_answers SET score = $2 WHERE id = $1', [ans.id, ans.question_max_score]);
          } else {
            await db.query('UPDATE test_answers SET score = 0 WHERE id = $1', [ans.id]);
          }
        }
      }
      // ESSAY and AUDIO are manually scored later; for now 0
    }

    // Insert or update test_scores
    const existingScore = await db.query('SELECT id FROM test_scores WHERE attempt_id = $1', [attemptId]);
    if (existingScore.rows.length > 0) {
      const update = await db.query(
        `UPDATE test_scores SET 
          multiple_choice_score = $2,
          essay_score = $3,
          audio_score = $4,
          passed = NULL
         WHERE attempt_id = $1 RETURNING *`,
        [attemptId, multipleChoiceScore, essayScore, audioScore]
      );
      return update.rows[0];
    } else {
      const insert = await db.query(
        `INSERT INTO test_scores (attempt_id, multiple_choice_score, essay_score, audio_score) 
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [attemptId, multipleChoiceScore, essayScore, audioScore]
      );
      return insert.rows[0];
    }
  }
}