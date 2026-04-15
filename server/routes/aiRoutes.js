const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');

// POST /api/ai/chat - Send message to AI
router.post('/chat', chatWithAI);

module.exports = router;
