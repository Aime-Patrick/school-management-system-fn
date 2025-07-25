import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export const LessonTableRow = ({ lesson, index, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4">{index + 1}</td>
    <td className="px-6 py-4">{lesson.courseCode}</td>
    <td className="px-6 py-4">{lesson.name}</td>
    <td className="px-6 py-4">{lesson.department}</td>
    <td className="px-6 py-4">{lesson.credits}</td>
    <td className="px-6 py-4 "><p className={`rounded-full text-center capitalize ${lesson.status === "active" ? "bg-green-600/20 text-green-600" : "bg-red-600/20 text-red-600"}`}>{lesson.status}</p></td>
    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onEdit(lesson)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(lesson)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </td>
  </tr>
);
