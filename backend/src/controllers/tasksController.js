const pool = require('../models/db');
const scheduleService = require('../services/scheduleService');
const taskService = require('../services/taskService');
const logger = require('../utils/logger');

class TasksController {
  /**
   * Gera tarefas a partir do plano de estudo
   */
  async generateTasks(req, res) {
    try {
      const { examId } = req.params;

      // Verificar se exame pertence ao usuário
      const examCheck = await pool.query(
        `SELECT e.*, sp.hours_per_day, sp.available_days
         FROM exams e
         LEFT JOIN study_plans sp ON e.id = sp.exam_id
         WHERE e.id = $1 AND e.user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const exam = examCheck.rows[0];

      if (!exam.hours_per_day) {
        return res.status(400).json({ error: 'Plano de estudo não configurado' });
      }

      // Buscar disciplinas e tópicos
      const subjectsResult = await pool.query(
        `SELECT * FROM subjects WHERE exam_id = $1`,
        [examId]
      );

      // Gerar cronograma
      const tasks = await scheduleService.generateSchedule(
        examId,
        new Date(exam.exam_date),
        exam.hours_per_day,
        exam.available_days,
        subjectsResult.rows
      );

      // Deletar tarefas antigas
      await pool.query(`DELETE FROM tasks WHERE exam_id = $1`, [examId]);

      // Criar novas tarefas
      if (tasks.length > 0) {
        await taskService.createTasksBatch(tasks);
      }

      logger.info(`Tarefas geradas para exame: ${examId}`);
      res.status(200).json({ message: `${tasks.length} tarefas geradas com sucesso`, tasks });
    } catch (error) {
      logger.error('Erro ao gerar tarefas:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtém tarefas de hoje
   */
  async getTodaysTasks(req, res) {
    try {
      const tasks = await taskService.getTodaysTasks(req.user.id);
      res.status(200).json(tasks);
    } catch (error) {
      logger.error('Erro ao buscar tarefas de hoje:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Marca tarefa como concluída
   */
  async completeTask(req, res) {
    try {
      const { taskId } = req.params;
      const { time_spent_minutes } = req.body;

      const task = await taskService.completeTask(taskId, time_spent_minutes || 0);
      res.status(200).json(task);
    } catch (error) {
      logger.error('Erro ao completar tarefa:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Marca tarefa como pulada
   */
  async skipTask(req, res) {
    try {
      const { taskId } = req.params;

      const task = await taskService.skipTask(taskId);
      res.status(200).json(task);
    } catch (error) {
      logger.error('Erro ao pular tarefa:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Lista tarefas de um exame
   */
  async getExamTasks(req, res) {
    try {
      const { examId } = req.params;
      const { status } = req.query;

      // Verificar acesso
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const tasks = await taskService.getExamTasks(examId, status);
      res.status(200).json(tasks);
    } catch (error) {
      logger.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TasksController();
