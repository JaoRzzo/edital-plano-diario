const express = require('express');
const topicsController = require('../controllers/topicsController');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => topicsController.createTopic(req, res));
router.get('/', (req, res) => topicsController.getTopics(req, res));
router.put('/:topicId', (req, res) => topicsController.updateTopic(req, res));
router.delete('/:topicId', (req, res) => topicsController.deleteTopic(req, res));

module.exports = router;
