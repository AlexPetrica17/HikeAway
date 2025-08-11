const mongoose = require('mongoose');

const invoiceCounterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'invoice',
    unique: true,
  },
  currentNumber: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model('InvoiceCounter', invoiceCounterSchema);
