const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Booking = require('../models/bookingModel');
const InvoiceCounter = require('../models/invoiceCounterModel');

exports.generateInvoice = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate(
    'tour user',
  );
  if (!booking) return res.status(404).send('Rezervare inexistentă');

  const counter = await InvoiceCounter.findOneAndUpdate(
    { name: 'invoice' },
    { $inc: { currentNumber: 1 } },
    { new: true, upsert: true },
  );
  const invoiceNumber = counter.currentNumber.toString().padStart(5, '0');

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=factura-${invoiceNumber}.pdf`,
  );

  doc.pipe(res);

  const fontPath = path.join(__dirname, '../public/fonts/Roboto-Regular.ttf');
  if (fs.existsSync(fontPath)) {
    doc.registerFont('roboto', fontPath);
    doc.font('roboto');
  }

  const logoPath = path.join(__dirname, '../public/img/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 50, { width: 100 });
  }

  doc
    .fontSize(20)
    .text(`Factura #${invoiceNumber}`, 400, 50, { align: 'right' });

  doc.fontSize(10);
  doc.text('Emitent:', 50, 150).moveDown(0.5);
  doc.text('HikeAway SRL.');
  doc.text('Str. Teodor Mihali 58-60, Cluj-Napoca');
  doc.text('CUI: RO12345678');
  doc.text('Nr. Reg. Com.: J12/345/2020');
  doc.moveDown();

  doc.text('Cumpărător:', 300, 150).moveDown(0.5);
  doc
    .text(`${booking.user.name}`, { continued: true })
    .text(`  (${booking.user.email})`);
  doc.text(`Data rezervării: ${booking.createdAt.toLocaleDateString('ro-RO')}`);
  doc.moveDown(2);

  const startY = doc.y;
  doc
    .fontSize(12)
    .text('DENUMIRE', 50, startY)
    .text('CANT.', 250, startY)
    .text('PREȚ', 320, startY)
    .text('TOTAL', 400, startY)
    .text('TVA', 480, startY);

  doc
    .moveTo(50, startY + 15)
    .lineTo(550, startY + 15)
    .stroke();

  const TVA_RATE = 0.19;
  const total = +booking.price;
  const tva = +(total * TVA_RATE).toFixed(2);
  const pretFaraTVA = +(total - tva).toFixed(2);

  doc
    .fontSize(11)
    .text(booking.tour.name, 50, startY + 25)
    .text('1', 250, startY + 25)
    .text(`${pretFaraTVA.toFixed(2)} RON`, 320, startY + 25)
    .text(`${pretFaraTVA.toFixed(2)} RON`, 400, startY + 25)
    .text(`${tva.toFixed(2)} RON`, 480, startY + 25);

  doc
    .moveTo(50, doc.y + 15)
    .lineTo(550, doc.y + 15)
    .stroke();

  doc.moveDown(2);
  const labelX = 360;
  const valueX = 450;
  const colWidth = 90;
  let currentY = doc.y + 10;

  doc.fontSize(12).fillColor('#000');
  doc.text('Subtotal:', labelX, currentY, {
    width: colWidth,
    lineBreak: false,
  });
  doc.text(`${pretFaraTVA.toFixed(2)} RON`, valueX, currentY, {
    width: colWidth,
    align: 'right',
    lineBreak: false,
  });

  currentY += 20;
  doc.text('TVA (19%):', labelX, currentY, {
    width: colWidth,
    lineBreak: false,
  });
  doc.text(`${tva.toFixed(2)} RON`, valueX, currentY, {
    width: colWidth,
    align: 'right',
    lineBreak: false,
  });

  currentY += 25;
  doc.fontSize(13).font('roboto').text('Total:', labelX, currentY, {
    width: colWidth,
    lineBreak: false,
  });
  doc.fontSize(13).text(`${total.toFixed(2)} RON`, valueX, currentY, {
    width: colWidth,
    align: 'right',
    underline: true,
    lineBreak: false,
  });

  doc
    .moveTo(50, currentY + 30)
    .lineTo(550, currentY + 30)
    .stroke();

  const footerY = doc.page.height - 100;

  doc
    .fontSize(12)
    .fillColor('#000')
    .text('Vă mulțumim pentru rezervare!', 50, footerY, { align: 'center' });

  doc
    .fontSize(8)
    .fillColor('#555')
    .text(
      'Factură valabilă fără semnătură și ștampilă conform art. 319 din Legea nr. 227/2015 privind Codul fiscal.',
      50,
      footerY + 20,
      { align: 'center' },
    );

  doc.end();
};
