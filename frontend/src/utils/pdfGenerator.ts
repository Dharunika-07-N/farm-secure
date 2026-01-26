import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateRiskPDF = (result: any, user: any) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // Header and Title
    doc.setFillColor(16, 185, 129); // BioSecure Green
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("BioSecure Risk Assessment Report", 20, 25);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 150, 50);
    doc.text(`Farmer: ${user?.firstName} ${user?.lastName}`, 20, 50);
    doc.text(`Farm: ${user?.farms?.[0]?.name || 'N/A'}`, 20, 55);

    // Overall Score
    doc.setFontSize(16);
    doc.text("Overall Biosecurity Score", 20, 70);
    doc.setFontSize(32);
    doc.setTextColor(result.score > 80 ? 34 : 220, result.score > 50 ? 197 : 38, result.score > 80 ? 94 : 38);
    doc.text(`${result.score}%`, 20, 85);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.text(`Risk Level: ${result.level.toUpperCase()}`, 20, 95);

    // Domain Breakdown Table
    doc.setFontSize(14);
    doc.text("Domain Breakdown", 20, 110);

    const domainData = Object.entries(result.domainScores || {}).map(([domain, score]) => [domain, `${score}%`]);

    autoTable(doc, {
        startY: 115,
        head: [["Biosecurity Domain", "Implementation Level"]],
        body: domainData,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
    });

    // Recommendations
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Priority Recommendations", 20, finalY);

    doc.setFontSize(10);
    let currentY = finalY + 10;
    result.recommendations.forEach((rec: string, index: number) => {
        const splitText = doc.splitTextToSize(`${index + 1}. ${rec}`, 170);
        doc.text(splitText, 20, currentY);
        currentY += splitText.length * 5;
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text("BioSecure Digital Platform - Preventing disease, protecting livelihoods.", 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }

    doc.save(`BioSecure_Assessment_${user?.lastName}_${date}.pdf`);
};
