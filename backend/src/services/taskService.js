const pool = require('../models/db');
const logger = require('../utils/logger');
const { TASK_STATUS } = require('../utils/constants');

class TaskService {
  /**
   * Obtém tarefas de hoje para um usuário
   */
  async getTodaysTasks(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const result = await pool.query(
        `SELECT t.id, t.exam_id, t.topic_id, t.type, t.planned_date, t.status, t.time_spent_minutes,
                tp.name as topic_name, s.name as subject_name, e.name as exam_name
         FROM tasks t
         LEFT JOIN topics tp ON t.topic_id = tp.id
         LEFT JOIN subjects s ON tp.subject_id = s.id
         LEFT JOIN exams e ON t.exam_id = e.id
         WHERE e.user_id = $1 AND t.planned_date = $2
         ORDER BY t.type DESC, t.created_at ASC`,
        [userId, today]
      );

      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar tarefas de hoje:', error);
      throw error;
    }
  }

  /**
   * Marca tarefa como concluída
   */
  async completeTask(taskId, timeSpentMinutes = 0) {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET status = $1, completed_date = NOW(), time_spent_minutes = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [TASK_STATUS.COMPLETED, timeSpentMinutes, taskId]
      );

      if (result.rows.length === 0) {
        throw new Error('Tarefa não encontrada');
      }

      logger.info(`Tarefa ${taskId} marcada como concluída`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao completar tarefa:', error);
      throw error;
    }
  }

  /**
   * Marca tarefa como ignorada (skipped)
   */
  async skipTask(taskId) {
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [TASK_STATUS.SKIPPED, taskId]
      );

      if (result.rows.length === 0) {
        throw new Error('Tarefa não encontrada');
      }

      logger.info(`Tarefa ${taskId} marcada como pulada`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao pular tarefa:', error);
      throw error;
    }
  }

  /**
   * Obtém tarefas de um exame
   */
  async getExamTasks(examId, status = null) {
    try {
      let query = `SELECT t.*, tp.name as topic_name, s.name as subject_name
                   FROM tasks t
                   LEFT JOIN topics tp ON t.topic_id = tp.id
                   LEFT JOIN subjects s ON tp.subject_id = s.id
                   WHERE t.exam_id = $1`;
      const params = [examId];

      if (status) {
        query += ` AND t.status = $2`;
        params.push(status);
      }

      query += ` ORDER BY t.planned_date ASC`;
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar tarefas do exame:', error);
      throw error;
    }
  }

  /**
   * Cria múltiplas tarefas em batch
   */
  async createTasksBatch(tasks) {
    try {
      const values = tasks.map(t => [
        t.examId,
        t.topicId || null,
        t.type,
        t.plannedDate,
        TASK_STATUS.PENDING,
      ]);

      const query = `INSERT INTO tasks (exam_id, topic_id, type, planned_date, status)
                     VALUES ${values.map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(',')}
                     RETURNING id`;
      
      const flatValues = values.flat();
      const result = await pool.query(query, flatValues);
      
      logger.info(`${result.rows.length} tarefas criadas em batch`);
      return result.rows;
    } catch (error) {
      logger.error('Erro ao criar tarefas em batch:', error);
      throw error;
    }
  }
}

module.exports = new TaskService();
