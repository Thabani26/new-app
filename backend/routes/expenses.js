
const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req,res)=>{ db.all(`SELECT * FROM expenses WHERE user_id=?`,[req.user.id],(err,rows)=>res.json(rows)); });

router.post('/', auth, (req,res)=>{
  const {title,amount,category} = req.body;
  const created_at = new Date().toISOString();
  db.run(`INSERT INTO expenses (user_id,title,amount,category,created_at) VALUES (?,?,?,?,?)`,
    [req.user.id,title,amount,category,created_at], function(err){ if(err) return res.status(400).json(err); res.json({id:this.lastID}); });
});

router.put('/:id', auth, (req,res)=>{
  const {title,amount,category} = req.body;
  db.run(`UPDATE expenses SET title=?,amount=?,category=? WHERE id=? AND user_id=?`,
    [title,amount,category,req.params.id,req.user.id], function(err){ if(err) return res.status(400).json(err); res.json({updated:true}); });
});

router.delete('/:id', auth, (req,res)=>{ db.run(`DELETE FROM expenses WHERE id=? AND user_id=?`,[req.params.id,req.user.id],function(err){ if(err) return res.status(400).json(err); res.json({deleted:true}); }); });

module.exports = router;