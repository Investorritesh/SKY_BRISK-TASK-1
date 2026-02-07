import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    const { invoiceNumber, customer, items, totalAmount, invoiceDate, dueDate } = invoice;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(25, 118, 210);
    doc.text('ERP SYSTEM INVOICE', 105, 20, { align: 'center' });

    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 40);
    doc.text(`Date: ${new Date(invoiceDate).toLocaleDateString()}`, 20, 48);
    doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString()}`, 20, 56);

    // Customer Details
    doc.text('Bill To:', 140, 40);
    doc.setFontSize(10);
    doc.text(customer.name, 140, 48);
    if (customer.company) doc.text(customer.company, 140, 56);
    if (customer.address) {
        doc.text(`${customer.address.street || ''}`, 140, 64);
        doc.text(`${customer.address.city || ''}, ${customer.address.state || ''}`, 140, 72);
    }

    // Items Table
    const tableColumn = ['Product', 'SKU', 'Quantity', 'Price', 'Total'];
    const tableRows = items.map((item) => [
        item.product.title,
        item.product.sku,
        item.quantity,
        `$${item.price.toFixed(2)}`,
        `$${item.total.toFixed(2)}`,
    ]);

    doc.autoTable({
        startY: 85,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillGray: [25, 118, 210] },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(25, 118, 210);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 140, finalY);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });

    // Save PDF
    doc.save(`${invoiceNumber}.pdf`);
};
