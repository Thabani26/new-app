
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const invoiceRoutes = require('./routes/invoices');
const expenseRoutes = require('./routes/expenses');
const aiRoutes = require('./routes/ai');
const paymentRoutes = require('./routes/payments');

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);

// Health endpoint
app.get('/health', (req, res) => {
	res.json({status: 'ok', timestamp: new Date().toISOString()});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));