import React from "react";
import { useSchools } from "../../../hooks/useSchool";

export const SaSchoolsStats = () => {
  const { schools } = useSchools();
  const totalSchools = schools ? schools.length : 0;
  const maxAvatars = 5;

  return (
    <div className="bg-navy-800 text-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Total Schools</h3>
          <p className="text-blue-200 text-sm">Schools managed by admin</p>
        </div>
        <span className="text-4xl font-extrabold">{totalSchools}</span>
      </div>

      <div className="mb-4">
        <span className="text-sm">Schools</span>
      </div>
      <div className="flex -space-x-2 items-center">
        {schools && schools.length > 0 ? (
          <>
            {schools.slice(0, maxAvatars).map((school) => (
              <img
                key={school.id}
                src={school.schoolLogo}
                alt={school.schoolName}
                title={school.schoolName}
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
            ))}
            {schools.length > maxAvatars && (
              <span className="ml-2 text-xs bg-blue-700 rounded-full px-2 py-1">
                +{schools.length - maxAvatars} more
              </span>
            )}
          </>
        ) : (
          <span>No schools available</span>
        )}
      </div>
    </div>
  );
};
