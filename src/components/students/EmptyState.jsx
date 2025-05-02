import React from 'react';
import { Empty } from 'antd';
export const EmptyState = ({ onAddStudent }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<span className="text-gray-500">No students found</span>}
      />
    </div>
    <p className="text-gray-600 mb-6">
      Students will appear here after they enroll in your school.
    </p>
    <button
      onClick={onAddStudent}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
    >
      Add Students
    </button>
  </div>
);
