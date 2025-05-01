import React, { useState } from "react";
import { DynamicBreadcrumb } from "../../Breadcrumb/DynamicBreadcrumb";
import { Button } from "primereact/button";
import OverlappingImages from "../../overlappingImages";
import { useStudentPayment } from "../../../hooks/useStudentPayment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Pencil, Trash2, CircleCheckBig, CircleX } from "lucide-react";
import { Input } from "antd";
import { convertDate } from "../../../utils";
import CountUpMotion from "../../CountUpMotion";
import { Tooltip } from "primereact/tooltip";
import { AddStudentPayment } from "../../Modal/addStudentPayment";
import { exportToExcel } from "../../../utils";
export const Payment = () => {
  const [visible, setVisible] = useState();
  const { data } = useStudentPayment();
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const imageBodyTemplate = (rowData) => {
    const proofFiles = rowData?.proof || [];

    if (proofFiles.length === 0) {
      return <p className="whitespace-nowrap">NO FILE</p>;
    }

    const imageFiles = proofFiles.filter((url) =>
      /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url)
    );

    const pdfFiles = proofFiles.filter((url) => /\.pdf$/i.test(url));

    return (
      <div className="flex flex-col gap-1">
        {imageFiles.length > 0 && <OverlappingImages images={imageFiles} />}

        {pdfFiles.length > 0 && (
          <div className="flex flex-col gap-1 mt-2">
            {pdfFiles.map((pdfUrl, index) => (
              <a
                key={index}
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-xs"
              >
                View PDF {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <div className="flex justify-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            data-pr-tooltip={
              rowData?.status === "paid" ? "Paid" : "unpaid"
            }
            data-pr-position="top"
          >
            {rowData && rowData.status === "paid" ? (
              <CircleCheckBig size={16} className="text-green-600" />
            ) : (
              <CircleX size={16} className="text-gray-600" />
            )}
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            data-pr-tooltip="Edit Payment"
            data-pr-position="top"
          >
            <Pencil size={16} className="text-gray-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            data-pr-tooltip="Delete Payment"
            data-pr-position="top"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
        <Tooltip target=".p-1" /> {/* Attach Tooltip to buttons */}
      </>
    );
  };

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }
  
    const exportData = data.map((student, index) => ({
      "#": index + 1,
      "Student name": `${student.studentId?.firstName || "N/A"} ${student.studentId?.lastName || "N/A"}`,
      "Student RegNumber": student.studentId?.registrationNumber || "N/A",
      "Class": student.studentId?.class?.name || "N/A",
      "School fees paid": student.schoolFees || "N/A",
      "Term": student.termId?.name || "N/A",
      "Academic Year": student.academicId?.name || "N/A",
      "Payment date": student.date ? convertDate(student.date) : "N/A",
      "Status": student.status || "N/A",
      "Payment method": student.paymentMethod || "N/A",
      "Payment status": student.paymentStatus || "N/A",
    }));
  
    exportToExcel(exportData, "Student payment", "Student_payment");
  };

  return (
    <div className="px-1 py-2">
      <div>
        <DynamicBreadcrumb />
      </div>
      <div className="w-full flex justify-between items-center">
        <div>
          <Input
            type="text"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search ..."
            className="pl-4 pr-4 py-2 rounded-lg border w-[300px]"
            prefix={<i className="pi pi-search"></i>}
          />
        </div>
        <div className="flex gap-3">
        <Button
          className="border border-navy-800 text-navy-800 btn text-sm focus:outline-none focus:ring-0"
          icon="pi pi-file-excel"
          label="Export to Excel"
          onClick={handleExport}
        />
        <Button
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
          icon="pi pi-plus"
          label="Record payment"
          onClick={() => setVisible(true)}
        />
        </div>
      </div>

      <div className="py-5 bg-white-400 mt-2 rounded-md shadow-md overflow-x-auto max-w-6xl" >
        <DataTable
          value={data}
          globalFilter={filters.global.value}
          emptytext="No payment found."
          filters={filters}
          tableClassName="text-[14px] bg-white whitespace-nowrap"
          tableStyle={{ minWidth: "10px" }}
          paginator
          rows={10}
        >
          <Column
            header="#"
            body={(rowData, { rowIndex }) => rowIndex + 1}
            style={{ width: "3rem" }}
          />
          <Column
            className="whitespace-nowrap"
            header="Student Names"
            body={(rowData) =>
              `${rowData.studentId?.firstName || "N/A"} ${
                rowData.studentId?.lastName || "N/A"
              }`
            }
          />
          <Column
            field="studentId.registrationNumber"
            header="Terms"
            className="whitespace-nowrap"
          />
          <Column
            field="studentId.class.name"
            header="Class"
            className="whitespace-nowrap"
          />
          <Column
            field="schoolFees"
            header="school fee"
            className="whitespace-nowrap"
            body={(rowData) => (
              <CountUpMotion to={rowData.schoolFees} prefix="$" duration={1.5} />
            )}
          />
          <Column
            field="termId.name"
            header="Terms"
            className="whitespace-nowrap"
          />
          <Column
            field="academicId.name"
            header="Academic Year"
            className="whitespace-nowrap"
          />
          <Column
            field="status"
            header="Status"
            className="whitespace-nowrap"
            body={(rowData) => (
              <span
                className={` capitalize px-4 py-2 rounded-full text-xs font-semibold ${
                  rowData.status === "paid"
                    ? "text-green-600 bg-green-600/10"
                    : "text-red-600 :bg-red-600/10"
                }`}
              >
                {rowData.status}
              </span>
            )}
          />
          <Column
            field="date"
            header="Date"
            className="whitespace-nowrap"
            body={(rowData) => convertDate(rowData.date)}
          />
          <Column
            field="proof"
            header="Proof"
            className="whitespace-nowrap"
            style={{ width: "10rem" }}
            body={imageBodyTemplate}
          />
          <Column header="Actions" body={actionBodyTemplate} />
        </DataTable>
      </div>

      {visible && (
        <AddStudentPayment
          onClose={() => setVisible(false)}
          visible={visible}
        />
      )}
    </div>
  );
};
