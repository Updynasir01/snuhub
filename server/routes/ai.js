const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const { verifyToken } = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/assist', verifyToken, async (req, res) => {
  try {
    const { prompt, context } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful writing assistant for student journalists. Provide constructive feedback and suggestions to improve their writing."
        },
        {
          role: "user",
          content: `Context: ${context}\n\nText to improve: ${prompt}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    res.json({
      suggestion: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      message: 'Error getting AI assistance',
      error: error.message 
    });
  }
});

module.exports = router; 