const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const logger = require('../utils/logger');

class AuthService {
  async registerUser(name, email, password) {
    try {
      // Verificar se usuário já existe
      const userExists = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (userExists.rows.length > 0) {
        throw new Error('Email já cadastrado');
      }

      // Hash da senha
      const passwordHash = await bcrypt.hash(password, 10);

      // Criar usuário
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, passwordHash]
      );

      logger.info(`Novo usuário criado: ${email}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Usuário ou senha inválidos');
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        throw new Error('Usuário ou senha inválidos');
      }

      // Gerar JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '7d' }
      );

      logger.info(`Usuário logado: ${email}`);
      return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      };
    } catch (error) {
      logger.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  async getUserById(userId) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
