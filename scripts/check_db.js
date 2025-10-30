const db = require('../beckend/database');

db.serialize(()=>{
  db.all('SELECT id,name,email,phone FROM clients', (err, rows) =>{
    if(err){ console.error('Error querying clients:', err); process.exit(1); }
    console.log('Clients:', rows);
    process.exit(0);
  });
});
