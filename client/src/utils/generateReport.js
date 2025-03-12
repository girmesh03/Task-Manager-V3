import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// function formatString(text) {
//   console.log("text", text)
//   return text
//     .split(".\n") // Split sentences by period and space
//     .map(sentence => sentence.trim()) // Trim extra spaces
//     .filter(sentence => sentence.length > 0) // Remove empty entries
//     .map((sentence) => {
//       // Add a newline before the second line of long sentences
//       if (sentence.length > 80) {
//         let words = sentence.split(' ');
//         let firstLine = [];
//         let secondLine = [];
//         let charCount = 0;

//         for (let word of words) {
//           if (charCount + word.length <= 80) {
//             firstLine.push(word);
//             charCount += word.length + 1;
//           } else {
//             secondLine.push(word);
//           }
//         }
//         return `- ${firstLine.join(' ')}\n  ${secondLine.join(' ')}`;
//       }
//       return `- ${sentence}`;
//     })
//     .join('\n'); // Join formatted sentences
// }

function formatString(text) {
  const maxLength = 80; // Define the max line length before wrapping

  return text
    .split('\n') // Split input by new lines
    .map(sentence => sentence.trim()) // Trim spaces
    .filter(sentence => sentence.length > 0) // Remove empty lines
    .map(sentence => {
      if (sentence.length > maxLength) {
        let words = sentence.split(' ');
        let lines = [];
        let currentLine = '';

        for (let word of words) {
          if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            lines.push(currentLine); // Push current line and start a new one
            currentLine = word;
          }
        }
        lines.push(currentLine); // Push the last line

        return `- ${lines[0]}\n  ${lines.slice(1).join('\n  ')}`; // Join wrapped lines with indentation
      }
      return `- ${sentence}`; // If sentence is short, keep it in one line
    })
    .join('\n'); // Join formatted lines
}

const generatePDF = (tasks, selectionModel) => {
  const doc = new jsPDF("landscape");

  const addHeader = (doc) => {
    const pageWidth = doc.internal.pageSize.width;

    // Add a bold title at the center
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Maintenance Report", pageWidth / 2, 20, { align: "center" });

    // Left-aligned report details (Company/Department)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text("Company: Elilly International Hotel", 14, 30);
    doc.text("Department: Engineering", 14, 36);
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 42);

    // Right-aligned details (Report Information)
    const rightX = pageWidth - 14;
    doc.text("Prepared by: Assistant Chief Engineer", rightX, 30, { align: "right" });
    doc.text("Report Type: Scheduled & Emergency Tasks", rightX, 36, { align: "right" });
    doc.text("Status: Internal Use Only", rightX, 42, { align: "right" });
    doc.text("Software: Task Manager Web App", rightX, 48, { align: "right" });
    doc.text("Developed by: Girmachew Zewdie", rightX, 54, { align: "right" });

    // Draw a horizontal line below the header
    doc.setLineWidth(0.5);
    doc.line(14, 57, pageWidth - 14, 57);
  };

  const formattedTasks = tasks.map((task) => ({
    ...task,
    id: task._id,
    description: formatString(task.description),
    date: dayjs(task.date).format("DD-MM-YYYY"),
    // week: dayjs(task.date).week(),
  }));


  // Determine which rows to export
  const rowsToExport =
    selectionModel.length > 0
      ? formattedTasks.filter((task) => selectionModel.includes(task.id))
      : formattedTasks;

  // Group tasks by date
  const groupedTasks = rowsToExport.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
    return acc;
  }, {});

  addHeader(doc); // Add header before tables start

  // let startY = 85; // Initial Y position for the first table
  let startY = 75; // Initial Y position for the first table

  // Loop through grouped tasks
  Object.entries(groupedTasks).forEach(([date, tasks], index) => {
    if (index > 0) {
      doc.addPage(); // Add a new page for each date
      addHeader(doc); // Add header after adding a new page
      startY = 75; // Reset start position for the new page
      // startY = 85; // Reset start position for the new page
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 14, startY - 5);
    // doc.text(`Date: ${date}`, 14, startY - 15);
    // doc.text(`Location: ${tasks[0]?.location}`, 14, startY - 10);
    // doc.text(`Title: ${tasks[0]?.title}`, 14, startY - 5);

    doc.autoTable({
      startY: startY, // Ensure enough space below the header
      theme: "grid",
      head: [["Location", "Title", "Description", "Status"]],
      // head: [["Date", "Location", "Title", "Description", "Status"]],
      body: tasks.map((task) => [
        // task.date,
        task.location,
        task.title,
        task.description,
        task.status,
      ]),
      headStyles: { fontSize: 12, halign: "center", },
      columnStyles: {
        // 0: { cellWidth: 30, halign: "center", valign: "top" },
        0: { cellWidth: "auto", halign: "left", valign: "top" },
        1: { cellWidth: "auto", halign: "left", valign: "top", },
        2: { cellWidth: "wrap", overflow: "linebreak", cellPadding: 3, halign: "left", },
        3: { cellWidth: 30, halign: "center", valign: "top" },
      },
      didDrawPage: (data) => {
        doc.setFontSize(10);
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    startY = doc.autoTable.previous.finalY + 15; // Move startY for the next table
  });

  doc.save("maintenance_report.pdf");
};

export default generatePDF;
