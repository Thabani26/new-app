
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const router = express.Router();
const SECRET = 'bizmate_secret';

router.post('/signup', async (req,res)=>{
  const {name,email,password} = req.body;
  const hashed = await bcrypt.hash(password,10);
  const trial_end = new Date(Date.now()+30*24*60*60*1000).toISOString();
  db.run(`INSERT INTO users (name,email,password,trial_end,role) VALUES (?,?,?,?,?)`,
    [name,email,hashed,trial_end,'business'], function(err){
      if(err) return res.status(400).json({error:err.message});
      const token = jwt.sign({id:this.lastID,email},SECRET);
      res.json({token});
    });
});

router.post('/login',(req,res)=>{
  const {email,password} = req.body;
  db.get(`SELECT * FROM users WHERE email=?`,[email], async(err,row)=>{
    if(err || !row) return res.status(400).json({error:'User not found'});
    const match = await bcrypt.compare(password,row.password);
    if(!match) return res.status(400).json({error:'Wrong password'});
    const token = jwt.sign({id:row.id,email:row.email},SECRET);
    res.json({token});
  });
});

module.exports = router;