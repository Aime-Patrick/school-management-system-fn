import React, { useEffect, useState } from "react";
import { Modal, Select, Button as AntButton } from "antd";
import { Loader } from "lucide-react";
export const AssignTeacherModal = ({ courses, teachers, onClose, onAssign, assignTeacherToCourseIsLoading }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const handleAssign = () => {
    if (!selectedCourse || selectedTeachers.length === 0) {
      alert("Please select a course and at least one teacher.");
      return;
    }
    onAssign(selectedCourse, selectedTeachers);
  };



  return (
    <Modal
      title="Assign Teacher to Course"
      visible={true}
      onCancel={onClose}
      footer={[
        <AntButton key="cancel" onClick={onClose}>
          Cancel
        </AntButton>,
        <AntButton
          key="assign"
          type="primary"
          onClick={handleAssign}
          disabled={!selectedCourse || selectedTeachers.length === 0 || assignTeacherToCourseIsLoading}
        >
          {assignTeacherToCourseIsLoading ? 
          <span className="flex items-center gap-2">
            <Loader className="animate-spin" size={16} />
            Assigning...
          </span>
          : "Assign"}
        </AntButton>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <Select
          placeholder="Select a course"
          value={selectedCourse}
          onChange={(value) => setSelectedCourse(value)}
          className="w-full"
          showSearch
          allowClear
        >
          {courses.map((course) => (
            <Select.Option key={course._id} value={course._id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Select teachers"
          value={selectedTeachers}
          onChange={(value) => setSelectedTeachers(value)}
          className="w-full"
          showSearch
          allowClear
        >
          {teachers.map((teacher) => (
            <Select.Option key={teacher._id} value={teacher._id}>
              {`${teacher.firstName} ${teacher.lastName}`}
            </Select.Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};