import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateCompliancePDF = (categories: any[], farmName: string) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFillColor(79, 70, 229); // Indigo/Blue
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Compliance Audit Report", 20, 20);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Farm: ${farmName}`, 20, 40);
    doc.text(`Audit Date: ${date}`, 150, 40);

    categories.forEach((cat, index) => {
        const startY = index === 0 ? 50 : (doc as any).lastAutoTable.finalY + 15;

        doc.setFontSize(14);
        doc.setTextColor(79, 70, 229);
        doc.text(cat.name, 20, startY);

        const tableData = cat.items.map((item: any) => [
            item.name,
            item.completed ? "COMPLIANT" : "NON-COMPLIANT",
            item.dueDate || "N/A",
            item.notes || "No notes"
        ]);

        autoTable(doc, {
            startY: startY + 5,
            head: [["Standard", "Status", "Due Date", "Notes"]],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 9 },
            columnStyles: {
                1: { halign: 'center', fontStyle: 'bold' }
            }
        });
    });

    doc.save(`Compliance_Report_${farmName}_${date}.pdf`);
};
