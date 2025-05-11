import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

async function generateCSVReport(data) {
    try {
        const headers = Object.keys(data[0]);
        const csvRows = [];

        csvRows.push(headers.join(','));

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] !== null && row[header] !== undefined
                    ? typeof row[header] === 'object'
                        ? row[header]
                            .map(vacc => `${vacc.vaccineName}-${vacc.vaccinatedOn}`)
                            .join('\n') 
                        : row[header]
                    : '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });


        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `report-${Date.now()}.csv`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating CSV report: ${error.message}`);
    }
}

async function generateExcelReport(data) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');


        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);


        data.forEach(row => {
            const rowData = headers.map(header => {
                if (header === 'vaccinations' && Array.isArray(row[header])) {
                    return row[header]
                        .map(vaccine => `${vaccine.vaccineName} - ${vaccine.vaccinatedOn}`)
                        .join('\n'); 
                }
                return row[header] !== null && row[header] !== undefined ? row[header] : '';
            });

            const newRow = worksheet.addRow(rowData);

            newRow.eachCell(cell => {
                cell.alignment = { wrapText: true, vertical: 'top' };
            });
        });

        headers.forEach((header, index) => {
            worksheet.getColumn(index + 1).width = 20; 
        });

        const blob = await workbook.xlsx.writeBuffer();
        const fileName = `report-${Date.now()}.xlsx`;
        saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
    } catch (error) {
        throw new Error(`Error generating Excel report: ${error.message}`);
    }
}


async function generatePDFReport(data) {
    try {
        const { jsPDF } = await import('jspdf'); 
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Vaccination Report', 105, 20, { align: 'center' });

        const headers = Object.keys(data[0]);

        const tableTop = 25;
        const cellPadding = 2;
        const colWidth = (doc.internal.pageSize.width - 20) / headers.length; 
        const rowHeight = 10;

        let xPos = 10;
        headers.forEach(header => {
            doc.setFontSize(10);

            const headerTextYPos = tableTop + cellPadding + 6; 
            doc.text(header, xPos + cellPadding, headerTextYPos);

            doc.rect(xPos, tableTop, colWidth, rowHeight);
            xPos += colWidth;
        });

        let yPos = tableTop + rowHeight;
        data.forEach(row => {
            xPos = 10;

            const rowHeights = headers.map(header => {
                const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                const wrappedText = doc.splitTextToSize(
                    typeof value === 'object'
                        ? row[header].map(vacc => `${vacc.vaccineName} - ${vacc.vaccinatedOn}`).join(', ')
                        : String(value),
                    colWidth - cellPadding * 2
                );
                return wrappedText.length * (rowHeight - 2); 
            });
            const maxRowHeight = Math.max(...rowHeights);

            headers.forEach(header => {
                let value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                if (typeof value === 'object') {
                    value = row[header].map(vacc => `${vacc.vaccineName} - ${vacc.vaccinatedOn}`).join(', ');
                }
                const wrappedText = doc.splitTextToSize(String(value), colWidth - cellPadding * 2);
                doc.setFontSize(9);
            
                const textYPos = yPos + cellPadding + 2;
                doc.text(wrappedText, xPos + cellPadding, textYPos, { maxWidth: colWidth - cellPadding * 2 });
                doc.rect(xPos, yPos, colWidth, maxRowHeight); 
                xPos += colWidth;
            });

            yPos += maxRowHeight;

            if (yPos + rowHeight > doc.internal.pageSize.height - 20) {
                doc.addPage();
                yPos = 20; 
            }
        });

        const blob = doc.output('blob');
        const fileName = `report-${Date.now()}.pdf`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating PDF report: ${error.message}`);
    }
}

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