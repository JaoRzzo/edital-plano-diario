const express = require('express');
const subjectsController = require('../controllers/subjectsController');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => subjectsController.createSubject(req, res));
router.get('/', (req, res) => subjectsController.getSubjects(req, res));
router.put('/:subjectId', (req, res) => subjectsController.updateSubject(req, res));
router.delete('/:subjectId', (req, res) => subjectsController.deleteSubject(req, res));

module.exports = router;
