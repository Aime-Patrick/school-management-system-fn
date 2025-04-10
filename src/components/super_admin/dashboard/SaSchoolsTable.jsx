import React from "react";
import { MoreVertical } from "lucide-react";
import { useSchools } from "../../../hooks/useSchool";
import { Empty } from "antd";


export const SaSchoolsTable = () => {
  const { isLoading, schools } = useSchools();
  const sortedSchools = [...schools]?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const schoolAdmin = (school) =>{
    return school.schoolAdmin.username
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="p-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold">Recent Joined Schools</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Logo
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              School Admin
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              School Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              School Email
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600"></th>
          </tr>
        </thead>
        {sortedSchools.length > 0 ? 
        <tbody>
          { sortedSchools.map((school) => (
            <tr key={school.id} className="border-t border-gray-100">
              <td className="px-4 py-3">
                <img
                  src={school.schoolLogo}
                  alt={`${school.schoolName} logo`}
                  className="w-8 h-8 rounded-full"
                />
              </td>
              <td className="px-4 py-3 text-sm">{schoolAdmin(school)}</td>
              <td className="px-4 py-3 text-sm">{school.schoolName}</td>
              <td className="px-4 py-3 text-sm">{school.email || school.schoolAdmin.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                  ${
                    school.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {school.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded"
                  aria-label="More options"
                >
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody> 
        : <div className="flex items-center justify-center w-full"> <p>No schools available</p></div>}
      </table>
    </div>
  </div>
  )
}
