const pool = require('../models/db');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

class QuestionsController {
  /**
   * Registra uma sessão de questões
   */
  async createQuestionSession(req, res) {
    try {
      const { examId } = req.params;
      const { subject_id, total_questions, correct_answers, wrong_answers, time_spent_minutes, notes } = req.body;

      if (!subject_id || !total_questions || correct_answers === undefined || wrong_answers === undefined) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
      }

      // Verificar acesso
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND e.id = $2 AND e.user_id = $3`,
        [subject_id, examId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `INSERT INTO question_sessions (exam_id, subject_id, session_date, total_questions, correct_answers, wrong_answers, time_spent_minutes, notes)
         VALUES ($1, $2, NOW()::DATE, $3, $4, $5, $6, $7)
         RETURNING *`,
        [examId, subject_id, total_questions, correct_answers, wrong_answers, time_spent_minutes || null, notes || null]
      );

      logger.info(`Sessão de questões registrada: ${result.rows[0].id}`);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao registrar sessão de questões:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtém evolução de uma disciplina
   */
  async getSubjectEvolution(req, res) {
    try {
      const { examId, subjectId } = req.params;

      // Verificar acesso
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND e.id = $2 AND e.user_id = $3`,
        [subjectId, examId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const evolution = await analyticsService.getSubjectEvolution(examId, subjectId);
      res.status(200).json(evolution);
    } catch (error) {
      logger.error('Erro ao buscar evolução:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém estatísticas gerais do exame
   */
  async getExamStats(req, res) {
    try {
      const { examId } = req.params;

      // Verificar acesso
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const stats = await analyticsService.getExamStats(examId);
      res.status(200).json(stats);
    } catch (error) {
      logger.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém estatísticas de tarefas
   */
  async getTasksStats(req, res) {
    try {
      const { examId } = req.params;

      // Verificar acesso
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const stats = await analyticsService.getTasksStats(examId);
      res.status(200).json(stats);
    } catch (error) {
      logger.error('Erro ao buscar estatísticas de tarefas:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QuestionsController();
