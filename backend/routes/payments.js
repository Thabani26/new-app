
const express = require('express');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req,res)=>{
  res.json({
    payfast:'https://www.payfast.co.za/pay/placeholder',
    yoco:'https://www.yoco.com/pay/placeholder',
    snapscan:'https://www.snapscan.co.za/pay/placeholder'
  });
});

module.exports = router;