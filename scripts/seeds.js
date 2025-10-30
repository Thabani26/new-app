const db = require('../beckend/database');
const bcrypt = require('bcrypt');

async function run() {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);

  db.serialize(()=>{
    // Insert demo user
    db.run(`INSERT OR IGNORE INTO users (id, name, email, password, trial_end, role) VALUES (1, 'Demo User', 'demo@bizmate.local', '${passwordHash}', '', 'admin')`);

    // Insert demo clients
    db.run(`INSERT OR IGNORE INTO clients (id, user_id, name, email, phone) VALUES (1,1,'ACME Corp','contact@acme.example','0123456789')`);
    db.run(`INSERT OR IGNORE INTO clients (id, user_id, name, email, phone) VALUES (2,1,'Beta LLC','hello@beta.example','0987654321')`);

    // Insert demo invoices
    db.run(`INSERT OR IGNORE INTO invoices (id, user_id, client_id, title, amount, status, created_at) VALUES (1,1,1,'Website Design',1500,'unpaid', datetime('now'))`);
    db.run(`INSERT OR IGNORE INTO invoices (id, user_id, client_id, title, amount, status, created_at) VALUES (2,1,2,'Consulting',800,'paid', datetime('now'))`);

    // Insert demo expenses
    db.run(`INSERT OR IGNORE INTO expenses (id, user_id, title, amount, category, created_at) VALUES (1,1,'Software Subscription',50,'saas', datetime('now'))`);
    db.run(`INSERT OR IGNORE INTO expenses (id, user_id, title, amount, category, created_at) VALUES (2,1,'Office Supplies',30,'office', datetime('now'))`);

    console.log('Seeding complete.');
    process.exit(0);
  });
}

run().catch(err=>{ console.error(err); process.exit(1); });
