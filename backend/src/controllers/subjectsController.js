const pool = require('../models/db');
const logger = require('../utils/logger');
const { validateSubjectData } = require('../middlewares/validators');

class SubjectsController {
  async createSubject(req, res) {
    try {
      const { examId } = req.params;
      const { name, weight, order_index } = req.body;

      validateSubjectData({ name, weight });

      // Verificar se exame pertence ao usuário
      const examCheck = await pool.query(
        `SELECT id FROM exams WHERE id = $1 AND user_id = $2`,
        [examId, req.user.id]
      );

      if (examCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `INSERT INTO subjects (exam_id, name, weight, order_index)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [examId, name, weight, order_index || null]
      );

      logger.info(`Disciplina criada: ${result.rows[0].id}`);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao criar disciplina:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getSubjects(req, res) {
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
        `SELECT * FROM subjects WHERE exam_id = $1 ORDER BY order_index ASC, created_at ASC`,
        [examId]
      );

      res.status(200).json(result.rows);
    } catch (error) {
      logger.error('Erro ao buscar disciplinas:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateSubject(req, res) {
    try {
      const { examId, subjectId } = req.params;
      const { name, weight, order_index } = req.body;

      // Verificar se exame e disciplina pertencem ao usuário
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND s.exam_id = $2 AND e.user_id = $3`,
        [subjectId, examId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `UPDATE subjects
         SET name = COALESCE($1, name), weight = COALESCE($2, weight), order_index = COALESCE($3, order_index), updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [name || null, weight || null, order_index || null, subjectId]
      );

      logger.info(`Disciplina atualizada: ${subjectId}`);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao atualizar disciplina:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSubject(req, res) {
    try {
      const { examId, subjectId } = req.params;

      // Verificar acesso
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND s.exam_id = $2 AND e.user_id = $3`,
        [subjectId, examId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      await pool.query(`DELETE FROM subjects WHERE id = $1`, [subjectId]);
      logger.info(`Disciplina deletada: ${subjectId}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Erro ao deletar disciplina:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubjectsController();
