import React, { useState } from "react";
import { DynamicBreadcrumb } from "../../Breadcrumb/DynamicBreadcrumb";
import { Button } from "primereact/button";
import { RecordPayment } from "../../Modal/recordPayment";
import OverlappingImages from "../../overlappingImages";
import { usePayment } from "../../../hooks/usePayment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Pencil, Trash2, CircleCheckBig, CircleX } from 'lucide-react';
import { Input } from "antd";
import { convertDate } from "../../../utils";
import CountUpMotion from "../../CountUpMotion";
import { Tooltip } from "primereact/tooltip";

export const SuperPayments = () => {
  const [visible, setVisible] = useState();
  const { payments } = usePayment();
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
            data-pr-tooltip={rowData?.status === "approved" ? "Approved" : "Not Approved"}
            data-pr-position="top"
          >
            {rowData && rowData.status === "approved" ? (
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

  return (
    <div className="px-5 py-2">
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
        <Button
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
          icon="pi pi-plus"
          label="Record payment"
          onClick={() => setVisible(true)}
        />
      </div>

      <div className="bg-white mt-2 rounded-md shadow-md">
        <DataTable
          value={payments}
          globalFilter={filters.global.value}
          emptytext="No payment found."
          filters={filters}
          tableClassName="text-[14px] bg-white whitespace-nowrap"
          tableStyle={{ minWidth: "60rem" }}
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
            header="School name"
            field="schoolId.schoolName"
          />
          <Column
            field="amount"
            header="Amount"
            className="whitespace-nowrap"
            body={(rowData) => (
                <CountUpMotion to={rowData.amount} prefix="$" duration={1.5} />
              )}                           
          />
          <Column field="plan" header="Plan" className="whitespace-nowrap" />
          <Column field="date" header="Date" className="whitespace-nowrap"  body={(rowData) => convertDate(rowData.date)}/>
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
        <RecordPayment onClose={() => setVisible(false)} visible={visible} />
      )}
    </div>
  );
};
