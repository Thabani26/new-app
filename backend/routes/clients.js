const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req,res)=>{ db.all(`SELECT * FROM clients WHERE user_id=?`,[req.user.id],(err,rows)=>res.json(rows)); });

router.post('/', auth, (req,res)=>{
  const {name,email,phone} = req.body;
  db.run(`INSERT INTO clients (user_id,name,email,phone) VALUES (?,?,?,?)`,
    [req.user.id,name,email,phone], function(err){ if(err) return res.status(400).json(err); res.json({id:this.lastID}); });
});

router.put('/:id', auth, (req,res)=>{
  const {name,email,phone} = req.body;
  db.run(`UPDATE clients SET name=?,email=?,phone=? WHERE id=? AND user_id=?`,
    [name,email,phone,req.params.id,req.user.id], function(err){ if(err) return res.status(400).json(err); res.json({updated:true}); });
});

router.delete('/:id', auth, (req,res)=>{
  db.run(`DELETE FROM clients WHERE id=? AND user_id=?`,[req.params.id,req.user.id],function(err){ if(err) return res.status(400).json(err); res.json({deleted:true}); });
});

module.exports = router;