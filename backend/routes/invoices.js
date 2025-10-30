
const express = require('express');
const db = require('../database');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req,res)=>{ db.all(`SELECT * FROM invoices WHERE user_id=?`,[req.user.id],(err,rows)=>res.json(rows)); });

router.post('/', auth, (req,res)=>{
  const {client_id,title,amount,status} = req.body;
  const created_at = new Date().toISOString();
  db.run(`INSERT INTO invoices (user_id,client_id,title,amount,status,created_at) VALUES (?,?,?,?,?,?)`,
    [req.user.id,client_id,title,amount,status,created_at], function(err){ if(err) return res.status(400).json(err); res.json({id:this.lastID}); });
});

router.put('/:id', auth, (req,res)=>{
  const {client_id,title,amount,status} = req.body;
  db.run(`UPDATE invoices SET client_id=?,title=?,amount=?,status=? WHERE id=? AND user_id=?`,
    [client_id,title,amount,status,req.params.id,req.user.id], function(err){ if(err) return res.status(400).json(err); res.json({updated:true}); });
});

router.delete('/:id', auth, (req,res)=>{ db.run(`DELETE FROM invoices WHERE id=? AND user_id=?`,[req.params.id,req.user.id],function(err){ if(err) return res.status(400).json(err); res.json({deleted:true}); }); });

module.exports = router;