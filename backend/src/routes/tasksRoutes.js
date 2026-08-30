const express = require('express');
const tasksController = require('../controllers/tasksController');

const router = express.Router({ mergeParams: true });

router.post('/generate', (req, res) => tasksController.generateTasks(req, res));
router.get('/today', (req, res) => tasksController.getTodaysTasks(req, res));
router.get('/', (req, res) => tasksController.getExamTasks(req, res));
router.post('/:taskId/complete', (req, res) => tasksController.completeTask(req, res));
router.post('/:taskId/skip', (req, res) => tasksController.skipTask(req, res));

module.exports = router;
