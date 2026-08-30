const express = require('express');
const questionsController = require('../controllers/questionsController');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => questionsController.createQuestionSession(req, res));
router.get('/analytics/subjects/:subjectId', (req, res) => questionsController.getSubjectEvolution(req, res));
router.get('/analytics/stats', (req, res) => questionsController.getExamStats(req, res));
router.get('/analytics/tasks', (req, res) => questionsController.getTasksStats(req, res));

module.exports = router;
