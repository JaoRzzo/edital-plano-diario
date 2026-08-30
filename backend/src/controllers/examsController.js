const pool = require('../models/db');
const logger = require('../utils/logger');
const { validateExamData } = require('../middlewares/validators');

class ExamsController {
  async createExam(req, res) {
    try {
      const { name, exam_date, edital_url } = req.body;

      validateExamData({ name, exam_date });

      const result = await pool.query(
        `INSERT INTO exams (user_id, name, exam_date, edital_url)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.user.id, name, exam_date, edital_url || null]
      );

      logger.info(`Exame criado: ${result.rows[0].id}`);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao criar exame:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getExams(req, res) {
    try {
      const result = await pool.query(
        `SELECT * FROM exams WHERE user_id = $1 ORDER BY exam_date ASC`,
        [req.user.id]
      );

      res.status(200).json(result.rows);
    } catch (error) {
      logger.error('Erro ao buscar exames:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getExamById(req, res) {
    try {
      const { examId } = req.params;

      const result = await pool.query(
        `SELECT * FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao buscar exame:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateExam(req, res) {
    try {
      const { examId } = req.params;
      const { name, exam_date, edital_url } = req.body;

      const result = await pool.query(
        `UPDATE exams SET name = COALESCE($1, name), exam_date = COALESCE($2, exam_date), edital_url = COALESCE($3, edital_url), updated_at = NOW()
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [name || null, exam_date || null, edital_url || null, examId, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }

      logger.info(`Exame atualizado: ${examId}`);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao atualizar exame:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteExam(req, res) {
    try {
      const { examId } = req.params;

      const result = await pool.query(
        `DELETE FROM exams WHERE id = $1 AND user_id = $2 RETURNING id`,
        [examId, req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Exame não encontrado' });
      }

      logger.info(`Exame deletado: ${examId}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Erro ao deletar exame:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ExamsController();
