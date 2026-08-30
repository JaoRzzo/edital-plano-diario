const pool = require('../models/db');
const logger = require('../utils/logger');

class StudyPlanController {
  async createStudyPlan(req, res) {
    try {
      const { examId } = req.params;
      const { hours_per_day, available_days, priorities, base_level } = req.body;

      // Verificar se exame pertence ao usuário
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      if (!hours_per_day || !available_days) {
        return res.status(400).json({ error: 'Horas por dia e dias disponíveis são obrigatórios' });
      }

      // Verificar se já existe plano de estudo
      const existingPlan = await pool.query(
        `SELECT id FROM study_plans WHERE exam_id = $1`,
        [examId]
      );

      let result;
      if (existingPlan.rows.length > 0) {
        // Atualizar plano existente
        result = await pool.query(
          `UPDATE study_plans
           SET hours_per_day = $1, available_days = $2, priorities = $3, base_level = $4, updated_at = NOW()
           WHERE exam_id = $5
           RETURNING *`,
          [hours_per_day, JSON.stringify(available_days), JSON.stringify(priorities), base_level, examId]
        );
      } else {
        // Criar novo plano
        result = await pool.query(
          `INSERT INTO study_plans (exam_id, hours_per_day, available_days, priorities, base_level)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [examId, hours_per_day, JSON.stringify(available_days), JSON.stringify(priorities), base_level]
        );
      }

      logger.info(`Plano de estudo criado/atualizado: ${examId}`);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao criar plano de estudo:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getStudyPlan(req, res) {
    try {
      const { examId } = req.params;

      // Verificar se exame pertence ao usuário
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `SELECT * FROM study_plans WHERE exam_id = $1`,
        [examId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Plano de estudo não encontrado' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao buscar plano de estudo:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StudyPlanController();
