import * as XLSX from "xlsx";
export const convertDate = (date) => {
  return new Date(date).toLocaleDateString("en-US");
};

export const exportToExcel = (data, fileName, sheetName = "Sheet1") => {
  // Convert data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate and download the Excel file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
