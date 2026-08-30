const express = require('express');
const studyPlanController = require('../controllers/studyPlanController');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => studyPlanController.createStudyPlan(req, res));
router.get('/', (req, res) => studyPlanController.getStudyPlan(req, res));

module.exports = router;
