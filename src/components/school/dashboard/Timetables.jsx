import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Modal, Select, Input, TimePicker, Button as AntButton } from "antd";
import { FilterMatchMode } from "primereact/api";
import { useClasses } from "../../../hooks/useClasses";
import { useCourses } from "../../../hooks/useCourses";
import { Loader } from "lucide-react";
import Timetable from "./Table";
export const Timetables = () => {
  const {
    classes,
    isLoading,
    updateClass,
    updateClassLoading,
    updateClassSuccess,
  } = useClasses();
  const { courses } = useCourses();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedclass, setSelectedClass] = useState("");
  const [startTime, setStartTime] = useState(null); // Start time
  const [endTime, setEndTime] = useState(null); // End time
  const [isNewDay, setIsNewDay] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [newDay, setNewDay] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
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

  const showModal = (classItem) => {
    setIsModalVisible(true);
    setSelectedClass(classItem);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedClass("");
    setStartTime(null);
    setEndTime(null);
    setSelectedCourse("");
    setSelectedTeacher("");
    setIsNewDay(false);
    setSelectedDay("");
    setNewDay("");
  };

  const handleAddLesson = () => {
    const newLesson = {
      subject: selectedCourse,
      startTime: startTime.format("h:mm A"),
      endTime: endTime.format("h:mm A"),
      teacher: selectedTeacher,
    };
    const existingDay = selectedclass.timetable.find(
      (entry) => entry.day === (isNewDay ? newDay : selectedDay)
    );

    let updatedTimetable;

    if (existingDay) {
      updatedTimetable = selectedclass.timetable.map((entry) => {
        if (entry.day === (isNewDay ? newDay : selectedDay)) {
          return {
            ...entry,
            schedule: [...entry.schedule, newLesson],
          };
        }
        return entry;
      });
    } else {
      updatedTimetable = [
        ...selectedclass.timetable,
        {
          day: isNewDay ? newDay : selectedDay,
          schedule: [newLesson],
        },
      ];
    }

    updateClass({
      id: selectedclass._id,
      classData: { timetable: updatedTimetable },
    });
  };

  useEffect(() => {
    if (updateClassSuccess) {
      handleCancel();
    }
  }, [updateClassSuccess]);

  useEffect(() => {
    if (updateClassLoading) {
      setActiveIndex(null); // Close all tabs
    }
  }, [updateClassLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <i
          className="pi pi-spin pi-spinner text-blue-700"
          style={{ fontSize: "2rem" }}
        ></i>
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Input
            type="text"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search ..."
            className="pl-4 pr-4 py-2 rounded-lg border w-[300px]"
          />
        </div>
        <Button
          label="Add Timetable"
          icon="pi pi-plus"
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
        />
      </div>

      <div className="shadow-lg bg-white rounded-md">
        <Accordion multiple activeIndex={activeIndex}
  onTabChange={(e) => setActiveIndex(e.index)}>
          {classes.map((classItem) => {
            return (
              <AccordionTab  key={classItem._id} header={classItem.name}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <Button
                      label="Add Lesson"
                      icon="pi pi-plus"
                      onClick={() => showModal(classItem)}
                      className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                  <Timetable timetableData={classItem.timetable} classId={classItem._id}/>
                  </div>
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
      </div>


      {isModalVisible && (
        <Modal
          title="Add Lesson"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <AntButton key="cancel" onClick={handleCancel}>
              Cancel
            </AntButton>,
            <AntButton
              key="submit"
              type="primary"
              onClick={handleAddLesson}
              //   className="bg-navy-800 text-white flex items-center gap-2"
              disabled={
                isNewDay
                  ? !newDay ||
                    !selectedCourse ||
                    !selectedTeacher ||
                    !startTime ||
                    !endTime ||
                    updateClassLoading
                  : !selectedDay ||
                    !selectedCourse ||
                    !selectedTeacher ||
                    !startTime ||
                    !endTime ||
                    updateClassLoading
              }
            >
              <span className="flex items-center gap-2">
                {updateClassLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Lesson"
                )}
              </span>
            </AntButton>,
          ]}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Are you adding a subject to a new day or an existing day?
              </label>
              <div className="flex gap-4">
                <AntButton
                  type={isNewDay ? "primary" : "default"}
                  onClick={() => setIsNewDay(true)}
                >
                  New Day
                </AntButton>
                <AntButton
                  type={!isNewDay ? "primary" : "default"}
                  onClick={() => setIsNewDay(false)}
                >
                  Existing Day
                </AntButton>
              </div>
            </div>

            {isNewDay ? (
              <Select
                placeholder={
                  isNewDay ? "Choose a new day" : "Select an existing day"
                }
                value={newDay || undefined}
                onChange={(value) => setNewDay(value)}
                className="w-full"
                showSearch
                allowClear
              >
                {isNewDay
                  ? [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                    ].map((day) => (
                      <Select.Option key={day} value={day}>
                        {day}
                      </Select.Option>
                    ))
                  : [
                      ...new Set(selectedclass.timetable.map((row) => row.day)),
                    ].map((day) => (
                      <Select.Option key={day} value={day}>
                        {day}
                      </Select.Option>
                    ))}
              </Select>
            ) : (
              <Select
                placeholder="Select an existing day"
                value={selectedDay || undefined}
                onChange={(value) => setSelectedDay(value)}
                className="w-full placeholder:text-gray-600"
              >
                {[
                  ...new Set(selectedclass.timetable.map((row) => row.day)),
                ].map((day) => (
                  <Select.Option key={day} value={day}>
                    {day}
                  </Select.Option>
                ))}
              </Select>
            )}

            <Select
              placeholder="Select a course"
              value={selectedCourse || undefined}
              onChange={(value) => setSelectedCourse(value)}
              className="w-full"
              showSearch
              allowClear
            >
              {courses.map((course) => (
                <Select.Option key={course._id} value={course.name}>
                  {course.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="Select a teacher"
              value={selectedTeacher || undefined}
              onChange={(value) => setSelectedTeacher(value)}
              className="w-full"
              showSearch
              allowClear
            >
              {courses
                .find((course) => course.name === selectedCourse)
                ?.teacherIds.map((teacher) => (
                  <Select.Option
                    key={teacher._id}
                    value={teacher._id}
                    className="capitalize"
                  >
                    {`${teacher.firstName} ${teacher.lastName}`}
                  </Select.Option>
                ))}
            </Select>
            <div className="flex gap-4">
              <TimePicker
                placeholder="Start Time"
                value={startTime}
                onChange={(value) => setStartTime(value)}
                format="h:mm A"
                className="w-full"
              />
              <TimePicker
                placeholder="End Time"
                value={endTime}
                onChange={(value) => setEndTime(value)}
                format="h:mm A"
                className="w-full"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
