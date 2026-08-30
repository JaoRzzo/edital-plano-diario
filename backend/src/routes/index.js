const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const authRoutes = require('./authRoutes');
const examsRoutes = require('./examsRoutes');
const subjectsRoutes = require('./subjectsRoutes');
const topicsRoutes = require('./topicsRoutes');
const studyPlanRoutes = require('./studyPlanRoutes');
const tasksRoutes = require('./tasksRoutes');
const questionsRoutes = require('./questionsRoutes');

const router = express.Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
router.use('/exams', authMiddleware, examsRoutes);
router.use('/exams/:examId/subjects', authMiddleware, subjectsRoutes);
router.use('/exams/:examId/subjects/:subjectId/topics', authMiddleware, topicsRoutes);
router.use('/exams/:examId/study-plans', authMiddleware, studyPlanRoutes);
router.use('/exams/:examId/tasks', authMiddleware, tasksRoutes);
router.use('/exams/:examId/questions', authMiddleware, questionsRoutes);

module.exports = router;
