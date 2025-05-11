import { saveAs } from 'file-saver';
// import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

async function generateCSVReport(data) {
    try {
        // Extract headers
        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers to CSV
        csvRows.push(headers.join(','));

        // Add data rows to CSV
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] !== null && row[header] !== undefined
                    ? typeof row[header] === 'object'
                        ? row[header]
                            .map(vacc => `${vacc.vaccineName}-${vacc.vaccinatedOn}`)
                            .join('\n') // Use line breaks for multiple values
                        : row[header]
                    : '';
                return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
            });
            csvRows.push(values.join(','));
        });

        // Create a Blob and trigger download
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `report-${Date.now()}.csv`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating CSV report: ${error.message}`);
    }
}

// Generate Excel report
async function generateExcelReport(data) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add data rows
        data.forEach(row => {
            const rowData = headers.map(header => {
                if (header === 'vaccinations' && Array.isArray(row[header])) {
                    // Format vaccinations as comma-separated values with line breaks
                    return row[header]
                        .map(vaccine => `${vaccine.vaccineName} - ${vaccine.vaccinatedOn}`)
                        .join('\n'); // Use line breaks
                }
                return row[header] !== null && row[header] !== undefined ? row[header] : '';
            });

            const newRow = worksheet.addRow(rowData);

            // Enable text wrapping for the row
            newRow.eachCell(cell => {
                cell.alignment = { wrapText: true, vertical: 'top' };
            });
        });

        // Adjust column widths for better readability
        headers.forEach((header, index) => {
            worksheet.getColumn(index + 1).width = 20; // Adjust width as needed
        });

        const blob = await workbook.xlsx.writeBuffer();
        const fileName = `report-${Date.now()}.xlsx`;
        saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
    } catch (error) {
        throw new Error(`Error generating Excel report: ${error.message}`);
    }
}

// Generate PDF report
async function generatePDFReport(data) {
    try {
        const { jsPDF } = await import('jspdf'); // Dynamically import jsPDF
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text('Vaccination Report', 105, 20, { align: 'center' });

        // Extract headers
        const headers = Object.keys(data[0]);

        // Table configuration
        const tableTop = 25;
        const cellPadding = 2;
        const colWidth = (doc.internal.pageSize.width - 20) / headers.length; // Adjust column width
        const rowHeight = 10;

        // Draw headers with borders
        let xPos = 10;
        headers.forEach(header => {
            doc.setFontSize(10);

            // Adjust yPos to add vertical padding for the header row
            const headerTextYPos = tableTop + cellPadding + 6; // Add extra padding for better alignment
            doc.text(header, xPos + cellPadding, headerTextYPos);

            // Draw border for the header cell
            doc.rect(xPos, tableTop, colWidth, rowHeight);
            xPos += colWidth;
        });

        // Draw rows with consistent heights
        let yPos = tableTop + rowHeight;
        data.forEach(row => {
            xPos = 10;

            // Calculate the maximum height for the current row
            const rowHeights = headers.map(header => {
                const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                const wrappedText = doc.splitTextToSize(
                    typeof value === 'object'
                        ? row[header].map(vacc => `${vacc.vaccineName} - ${vacc.vaccinatedOn}`).join(', ')
                        : String(value),
                    colWidth - cellPadding * 2
                );
                return wrappedText.length * (rowHeight - 2); // Adjust rowHeight to account for padding
            });
            const maxRowHeight = Math.max(...rowHeights);

            // Draw cells for the current row
            headers.forEach(header => {
                let value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                if (typeof value === 'object') {
                    value = row[header].map(vacc => `${vacc.vaccineName} - ${vacc.vaccinatedOn}`).join(', ');
                }
                const wrappedText = doc.splitTextToSize(String(value), colWidth - cellPadding * 2);
                doc.setFontSize(9);
            
                // Adjust yPos to add vertical padding
                const textYPos = yPos + cellPadding + 2; // Add 2px extra padding for vertical spacing
                doc.text(wrappedText, xPos + cellPadding, textYPos, { maxWidth: colWidth - cellPadding * 2 });
                doc.rect(xPos, yPos, colWidth, maxRowHeight); // Draw border
                xPos += colWidth;
            });

            yPos += maxRowHeight;

            // Add a new page if the content exceeds the page height
            if (yPos + rowHeight > doc.internal.pageSize.height - 20) {
                doc.addPage();
                yPos = 20; // Reset yPos for the new page
            }
        });

        const blob = doc.output('blob');
        const fileName = `report-${Date.now()}.pdf`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating PDF report: ${error.message}`);
    }
}

// Main function to generate report based on format
async function generateReport(data, format) {
    switch (format.toLowerCase()) {
        case 'csv':
            return generateCSVReport(data);
        case 'excel':
            return generateExcelReport(data);
        case 'pdf':
            return generatePDFReport(data);
        default:
            throw new Error('Unsupported format');
    }
}

export { generateReport };