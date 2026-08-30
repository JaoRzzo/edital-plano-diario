const pool = require('../models/db');
const logger = require('../utils/logger');

class TopicsController {
  async createTopic(req, res) {
    try {
      const { subjectId } = req.params;
      const { name, estimated_hours } = req.body;

      if (!name || !estimated_hours) {
        return res.status(400).json({ error: 'Nome e horas estimadas são obrigatórios' });
      }

      // Verificar se disciplina existe e pertence ao usuário
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND e.user_id = $2`,
        [subjectId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `INSERT INTO topics (subject_id, name, estimated_hours)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [subjectId, name, estimated_hours]
      );

      logger.info(`Tópico criado: ${result.rows[0].id}`);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao criar tópico:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getTopics(req, res) {
    try {
      const { subjectId } = req.params;

      // Verificar acesso
      const check = await pool.query(
        `SELECT s.id FROM subjects s
         JOIN exams e ON s.exam_id = e.id
         WHERE s.id = $1 AND e.user_id = $2`,
        [subjectId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `SELECT * FROM topics WHERE subject_id = $1 ORDER BY created_at ASC`,
        [subjectId]
      );

      res.status(200).json(result.rows);
    } catch (error) {
      logger.error('Erro ao buscar tópicos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateTopic(req, res) {
    try {
      const { subjectId, topicId } = req.params;
      const { name, estimated_hours } = req.body;

      // Verificar acesso
      const check = await pool.query(
        `SELECT t.id FROM topics t
         JOIN subjects s ON t.subject_id = s.id
         JOIN exams e ON s.exam_id = e.id
         WHERE t.id = $1 AND s.id = $2 AND e.user_id = $3`,
        [topicId, subjectId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const result = await pool.query(
        `UPDATE topics
         SET name = COALESCE($1, name), estimated_hours = COALESCE($2, estimated_hours), updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [name || null, estimated_hours || null, topicId]
      );

      logger.info(`Tópico atualizado: ${topicId}`);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      logger.error('Erro ao atualizar tópico:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTopic(req, res) {
    try {
      const { subjectId, topicId } = req.params;

      // Verificar acesso
      const check = await pool.query(
        `SELECT t.id FROM topics t
         JOIN subjects s ON t.subject_id = s.id
         JOIN exams e ON s.exam_id = e.id
         WHERE t.id = $1 AND s.id = $2 AND e.user_id = $3`,
        [topicId, subjectId, req.user.id]
      );

      if (check.rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      await pool.query(`DELETE FROM topics WHERE id = $1`, [topicId]);
      logger.info(`Tópico deletado: ${topicId}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Erro ao deletar tópico:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TopicsController();
