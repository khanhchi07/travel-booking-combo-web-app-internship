const express = require('express');
const cors = require('cors');

const comboRoutes = require('./routes/comboRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.use(express.json());
app.use('/combos', comboRoutes);
app.use('/booking-requests', bookingRoutes);
app.use('/promotions', promotionRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});                         