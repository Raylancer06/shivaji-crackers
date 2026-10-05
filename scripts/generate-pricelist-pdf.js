const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default;
const { createClient } = require('@supabase/supabase-js');

async function generatePdf() {
  console.log('Fetching products and categories for PDF generation...');

  const supabaseUrl = 'https://jdaqvsgbchcljcwabiqy.supabase.co';
  const supabaseKey = 'sb_publishable_e27nlicqzJu4s-NtOfyn2g_jjkL80v1';
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch categories
  const { data: dbCategories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (catErr) console.warn('Categories query error:', catErr);

  // 2. Fetch all products
  const { data: dbProducts, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('category_slug', { ascending: true })
    .order('sku', { ascending: true });

  if (prodErr) console.warn('Products query error:', prodErr);

  let products = dbProducts || [];
  let categories = dbCategories || [];

  console.log(`Loaded ${products.length} products and ${categories.length} categories.`);

  // Setup jsPDF (A4 portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const MAROON = [85, 12, 18];       // #550C12
  const LIGHT_MAROON = [123, 20, 28]; // #7B141C
  const GOLD = [201, 142, 42];        // #C98E2A
  const BRIGHT_GOLD = [240, 181, 67]; // #F0B543
  const DARK_TEXT = [28, 20, 17];     // #1C1411
  const MUTED_TEXT = [102, 87, 79];   // #66574F
  const LIGHT_BG = [250, 248, 245];   // #FAF8F5

  // Helper for drawing header on first page
  function drawFirstPageHeader() {
    // Top banner background
    doc.setFillColor(...MAROON);
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Decorative Gold Stripe
    doc.setFillColor(...GOLD);
    doc.rect(0, 42, pageWidth, 2.5, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('SIVAJI FIRECRACKER', pageWidth / 2, 13, { align: 'center' });

    // Subtitle
    doc.setFontSize(10.5);
    doc.setTextColor(...BRIGHT_GOLD);
    doc.text('OFFICIAL WHOLESALE FACTORY DIRECT PRICE LIST • DIWALI 2026', pageWidth / 2, 19, { align: 'center' });

    // Trust Credentials
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(240, 235, 230);
    doc.text('100% CSIR-NEERI Green Certified  |  PESO Approved  |  Direct Sivakasi Factory Wholesale', pageWidth / 2, 25, { align: 'center' });

    // Contact info bar
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Helpline / WhatsApp: +91 83740 44445   •   Email: sivajiduddempudi42@gmail.com   •   Hyderabad, Telangana', pageWidth / 2, 33, { align: 'center' });
    doc.text('Wholesale Flat Discounts Applied  •  Minimum Order: Rs. 2,000  •  Free Delivery in Hyderabad above Rs. 5,000', pageWidth / 2, 38, { align: 'center' });
  }

  // Draw header
  drawFirstPageHeader();

  // Group products by category
  const categoryMap = new Map();
  categories.forEach((c) => {
    categoryMap.set(c.slug, c.name);
  });

  const grouped = {};
  products.forEach((p) => {
    const catSlug = p.category_slug || 'other';
    const catName = categoryMap.get(catSlug) || p.subtitle || 'Crackers Varieties';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(p);
  });

  // Table Data preparation
  const tableRows = [];

  let serial = 1;
  for (const [catName, catProducts] of Object.entries(grouped)) {
    // Category Divider Header Row
    tableRows.push([
      {
        content: `  ★  ${catName.toUpperCase()} (${catProducts.length} Varieties)`,
        colSpan: 7,
        styles: {
          fillColor: MAROON,
          textColor: [240, 181, 67],
          fontStyle: 'bold',
          fontSize: 9.5,
          halign: 'left',
          cellPadding: { top: 3.5, bottom: 3.5, left: 4 },
        },
      },
    ]);

    // Product rows
    catProducts.forEach((p) => {
      const mrp = Number(p.mrp) || 0;
      const wholesale = Number(p.selling_price) || 0;
      const discount = mrp > 0 ? Math.round(((mrp - wholesale) / mrp) * 100) : 0;
      const packing = (p.pieces || `${p.box_quantity || 1} ${p.quantity_unit || 'Box'}`).replace(/^Box Contains:\s*/i, '');

      tableRows.push([
        p.sku || `PRD-${serial}`,
        p.name,
        packing,
        `Rs. ${mrp.toLocaleString('en-IN')}`,
        `Rs. ${wholesale.toLocaleString('en-IN')}`,
        `${discount}% OFF`,
        '________', // Blank line for hand-written order qty
      ]);
      serial++;
    });
  }

  // Render Table with autoTable
  autoTable(doc, {
    startY: 48,
    head: [
      ['Code', 'Product Description', 'Packing / Pcs', 'MRP', 'Wholesale Rate', 'Savings', 'Order Qty'],
    ],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.8,
      cellPadding: 2,
      textColor: DARK_TEXT,
      lineColor: [226, 215, 197], // #E2D7C5
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: LIGHT_MAROON,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: [123, 20, 28] },
      1: { cellWidth: 68, fontStyle: 'bold' },
      2: { cellWidth: 32, textColor: MUTED_TEXT, fontSize: 7.2 },
      3: { cellWidth: 20, halign: 'right', textColor: [140, 122, 112] },
      4: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [85, 12, 18] },
      5: { cellWidth: 16, halign: 'center', fontStyle: 'bold', textColor: [7, 84, 44] }, // green
      6: { cellWidth: 16, halign: 'center', textColor: [180, 180, 180] },
    },
    alternateRowStyles: {
      fillColor: [253, 251, 248],
    },
    margin: { top: 16, right: 9, bottom: 16, left: 9 },
    didDrawPage: function (data) {
      // Header for pages after the first page
      if (data.pageNumber > 1) {
        doc.setFillColor(...MAROON);
        doc.rect(0, 0, pageWidth, 11, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text('SIVAJI FIRECRACKER • WHOLESALE FESTIVAL PRICE LIST 2026', 10, 7.5);
        doc.setFontSize(7.5);
        doc.setTextColor(...BRIGHT_GOLD);
        doc.text('Helpline: +91 83740 44445  |  Flat Direct Factory Rates', pageWidth - 10, 7.5, { align: 'right' });
      }

      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 122, 112);
      doc.text(
        'Sivaji Firecracker • Hyderabad Express Delivery • Minimum Order Rs. 2,000 • Order via Phone/WhatsApp: +91 83740 44445',
        10,
        pageHeight - 6
      );
      doc.text(
        `Page ${data.pageNumber} of {total_pages_count_placeholder}`,
        pageWidth - 10,
        pageHeight - 6,
        { align: 'right' }
      );
    },
  });

  // Now append a Final Summary / Ordering Information Page
  doc.addPage();
  const finalPageY = 20;

  // Header Box
  doc.setFillColor(...MAROON);
  doc.roundedRect(10, finalPageY, pageWidth - 20, 24, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('HOW TO COMPLETE YOUR FESTIVAL ORDER', pageWidth / 2, finalPageY + 9, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(...BRIGHT_GOLD);
  doc.text('Simple, Transparent & 100% Legal Factory Direct Process', pageWidth / 2, finalPageY + 17, { align: 'center' });

  // 4 Steps Grid
  const steps = [
    {
      num: 'STEP 1',
      title: 'Select Your Crackers',
      desc: 'Mark the required quantities in the "Order Qty" column above, or browse our live website estimate calculator at sivajifirecracker.com.',
    },
    {
      num: 'STEP 2',
      title: 'Submit Inquiry / WhatsApp',
      desc: 'Send a photo or screenshot of your list to WhatsApp +91 83740 44445 or submit directly on the website estimate sheet.',
    },
    {
      num: 'STEP 3',
      title: 'Instant Telephonic Confirmation',
      desc: 'Our logistics team calls you within 2 hours to confirm your packing, calculate exact wholesale discount, and finalize delivery slots.',
    },
    {
      num: 'STEP 4',
      title: 'Direct Hyderabad Delivery',
      desc: 'Parcels dispatched in heavy-duty fire-safe cartons with tracked courier / express doorstep delivery in Hyderabad & across Telangana.',
    },
  ];

  let currentY = finalPageY + 32;
  steps.forEach((step, idx) => {
    // Card background
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.4);
    doc.roundedRect(10, currentY, pageWidth - 20, 22, 2, 2, 'FD');

    // Badge
    doc.setFillColor(...LIGHT_MAROON);
    doc.roundedRect(14, currentY + 4, 18, 6, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(step.num, 23, currentY + 8.2, { align: 'center' });

    // Step Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...MAROON);
    doc.text(step.title, 36, currentY + 8.5);

    // Step Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...DARK_TEXT);
    doc.text(step.desc, 14, currentY + 16, { maxWidth: pageWidth - 28 });

    currentY += 26;
  });

  // Payment & Bank Transfer Box
  currentY += 4;
  doc.setFillColor(255, 248, 237); // #FFF8ED
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.roundedRect(10, currentY, pageWidth - 20, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...MAROON);
  doc.text('OFFICIAL PAYMENT DETAILS (100% SECURE DIRECT TRANSFER)', 15, currentY + 8);

  doc.setFontSize(8.5);
  doc.setTextColor(...DARK_TEXT);
  doc.text('UPI ID: sivajiduddempudi422@axl', 15, currentY + 16);
  doc.text('UPI Payee Name: Sivaji Duddempudi', 15, currentY + 22);
  doc.text('WhatsApp Payment Confirmation: +91 83740 44445', 15, currentY + 28);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED_TEXT);
  doc.text('* Please share UTR / Payment reference number on WhatsApp after payment for immediate dispatch barcode generation.', 15, currentY + 33);

  // Supreme Court Legal Disclaimer Box
  currentY += 42;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(10, currentY, pageWidth - 20, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DARK_TEXT);
  doc.text('STATUTORY SUPREME COURT LEGAL COMPLIANCE NOTICE:', 14, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...MUTED_TEXT);
  const disclaimerText = 'As per 2018 Supreme Court Order, Online Sale of Firecrackers are NOT permitted. We Value our customers and at the same time, we respect the jurisdiction. We request our customers to Select Your Products in Estimate Page to see your Estimation and Submit the required crackers through the order process. We will contact you within 2 hrs and Confirm the Order through Phone Call. Please Add and Submit Your inquiries and enjoy your Diwali with Sivaji Firecracker. Sivaji Firecracker is an enterprise following 100% legal & statutory compliances and all our facilities are maintained as per the explosive acts. We send the parcels through registered and legal delivery service providers.';
  doc.text(disclaimerText, 14, currentY + 11, { maxWidth: pageWidth - 28 });

  // Contact Footer Box
  currentY += 34;
  doc.setFillColor(...MAROON);
  doc.roundedRect(10, currentY, pageWidth - 20, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('SIVAJI FIRECRACKER WHOLESALE HEADQUARTERS', pageWidth / 2, currentY + 7, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(...BRIGHT_GOLD);
  doc.text('Helpline: +91 83740 44445   |   Hyderabad, Telangana, India   |   sivajifirecracker.com', pageWidth / 2, currentY + 13, { align: 'center' });

  // Replace total_pages_count_placeholder with actual count
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(140, 122, 112);
    // Overwrite the placeholder text cleanly
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - 10,
      pageHeight - 6,
      { align: 'right' }
    );
  }

  // Save to public directory
  const outputPath = path.join(__dirname, '../public/sivaji-firecracker-wholesale-price-list.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);

  console.log(`✅ Successfully generated official PDF Price List: ${outputPath}`);
  console.log(`File size: ${(pdfBuffer.length / 1024).toFixed(1)} KB across ${totalPages} pages.`);
}

generatePdf().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
