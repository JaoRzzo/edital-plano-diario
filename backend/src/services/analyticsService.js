const pool = require('../models/db');
const logger = require('../utils/logger');

class AnalyticsService {
  /**
   * Obtém estatísticas de evolução por disciplina
   */
  async getSubjectEvolution(examId, subjectId) {
    try {
      const result = await pool.query(
        `SELECT session_date, total_questions, correct_answers, wrong_answers,
                ROUND((correct_answers::float / total_questions * 100)::numeric, 2) as accuracy_percentage
         FROM question_sessions
         WHERE exam_id = $1 AND subject_id = $2
         ORDER BY session_date ASC`,
        [examId, subjectId]
      );

      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar evolução do assunto:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas gerais do exame
   */
  async getExamStats(examId) {
    try {
      const result = await pool.query(
        `SELECT s.id, s.name,
                COUNT(qs.id) as total_sessions,
                SUM(qs.correct_answers) as total_correct,
                SUM(qs.wrong_answers) as total_wrong,
                SUM(qs.total_questions) as total_questions_done,
                ROUND((SUM(qs.correct_answers)::float / SUM(qs.total_questions) * 100)::numeric, 2) as overall_accuracy
         FROM subjects s
         LEFT JOIN question_sessions qs ON s.id = qs.subject_id
         WHERE s.exam_id = $1
         GROUP BY s.id, s.name
         ORDER BY s.order_index ASC`,
        [examId]
      );

      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas do exame:', error);
      throw error;
    }
  }

  /**
   * Obtém resumo de tarefas completadas
   */
  async getTasksStats(examId) {
    try {
      const result = await pool.query(
        `SELECT status, COUNT(*) as count
         FROM tasks
         WHERE exam_id = $1
         GROUP BY status`,
        [examId]
      );

      const stats = {
        pending: 0,
        in_progress: 0,
        completed: 0,
        skipped: 0,
      };

      result.rows.forEach(row => {
        stats[row.status] = row.count;
      });

      return stats;
    } catch (error) {
      logger.error('Erro ao buscar estatísticas de tarefas:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
