const authService = require('../services/authService');
const logger = require('../utils/logger');
const { validateEmail, validatePassword } = require('../middlewares/validators');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
      }

      const user = await authService.registerUser(name, email, password);
      res.status(201).json({ message: 'Usuário criado com sucesso', user });
    } catch (error) {
      logger.error('Erro no registro:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await authService.loginUser(email, password);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Erro no login:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      logger.error('Erro ao buscar perfil:', error);
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
