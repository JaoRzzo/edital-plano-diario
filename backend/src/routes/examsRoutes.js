const express = require('express');
const examsController = require('../controllers/examsController');

const router = express.Router();

router.post('/', (req, res) => examsController.createExam(req, res));
router.get('/', (req, res) => examsController.getExams(req, res));
router.get('/:examId', (req, res) => examsController.getExamById(req, res));
router.put('/:examId', (req, res) => examsController.updateExam(req, res));
router.delete('/:examId', (req, res) => examsController.deleteExam(req, res));

module.exports = router;
