
const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', auth, (req,res)=>{
  const {question} = req.body;
  const answer = `BizMate AI placeholder answer for: ${question}`;
  const created_at = new Date().toISOString();
  db.run(`INSERT INTO ai_chats (user_id,question,answer,created_at) VALUES (?,?,?,?)`,
    [req.user.id,question,answer,created_at], function(err){ if(err) return res.status(400).json(err); res.json({answer}); });
});

module.exports = router;