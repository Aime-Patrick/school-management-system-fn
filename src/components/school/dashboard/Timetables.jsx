import React, { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Modal, Select, Input, TimePicker, Button as AntButton } from "antd";
import { FilterMatchMode } from "primereact/api";
import { useCourses } from "../../../hooks/useCourses";
import { Loader } from "lucide-react";
import Timetable from "./Table";
import { useClassBySchoolId } from "../../../hooks/useClassesBySchoolId";
import { useAuth } from "../../../hooks/useAuth";
import { useTimeTable } from "../../../hooks/useClassesBySchoolId";
export const Timetables = () => {
  const { 
    assignTimetableToCombinationMutation,
    updateTimetableForCombinationMutation 
  } = useTimeTable();
  const { authData } = useAuth();
  const { classes, isLoading } = useClassBySchoolId(authData?.schoolId);
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

  // Filter classes based on search
  const filteredClasses = classes?.filter((classItem) => {
    if (!globalFilterValue) return true;
    
    const searchTerm = globalFilterValue.toLowerCase();
    
    // Search in class name
    if (classItem.name?.toLowerCase().includes(searchTerm)) return true;
    
    // Search in combinations
    if (classItem.combinations?.some(comb => 
      comb.name?.toLowerCase().includes(searchTerm)
    )) return true;
    
    return false;
  }) || [];

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
    

    const currentCombinationTimetable = selectedclass.combination?.timetable || [];

    const existingDay = currentCombinationTimetable.find(
      (entry) => entry.day === (isNewDay ? newDay : selectedDay)
    );

    let updatedCombinationTimetable;

    if (existingDay) {
      updatedCombinationTimetable = currentCombinationTimetable.map((entry) => {
        if (entry.day === (isNewDay ? newDay : selectedDay)) {
          return {
            ...entry,
            schedule: [...entry.schedule, newLesson],
          };
        }
        return entry;
      });
    } else {
      updatedCombinationTimetable = [
        ...currentCombinationTimetable,
        {
          day: isNewDay ? newDay : selectedDay,
          schedule: [newLesson],
        },
      ];
    }

    // Check if this is a new timetable or updating existing one
    const hasExistingTimetable = selectedclass.combination?.timetable && selectedclass.combination.timetable.length > 0;
    
    if (hasExistingTimetable) {
      // Update existing timetable
      updateTimetableForCombinationMutation.mutate({
        combinationId: selectedclass.combination._id,
        timetable: updatedCombinationTimetable,
      });
    } else {
      // Assign new timetable
      assignTimetableToCombinationMutation.mutate({
        combinationId: selectedclass.combination._id,
        timetable: updatedCombinationTimetable,
      });
    }
  };

  useEffect(() => {
    if (updateTimetableForCombinationMutation.isSuccess || assignTimetableToCombinationMutation.isSuccess) {
      handleCancel();
    }
  }, [updateTimetableForCombinationMutation.isSuccess, assignTimetableToCombinationMutation.isSuccess]);

  useEffect(() => {
    if (updateTimetableForCombinationMutation.isPending || assignTimetableToCombinationMutation.isPending) {
      setActiveIndex(null); // Close all tabs
    }
  }, [updateTimetableForCombinationMutation.isPending, assignTimetableToCombinationMutation.isPending]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header Section */}
      <div className="mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timetable Management</h1>
          <p className="text-gray-600">Organize and manage class schedules for all combinations</p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative">
              <Input
                type="text"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Search classes or combinations..."
                className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 w-full sm:w-80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                prefix={
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              label="Add New Lesson"
              icon="pi pi-plus"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <Accordion 
            multiple 
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
            className="custom-accordion"
          >
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-gray-900 font-semibold mb-2">No Results Found</h3>
              <p className="text-gray-500 text-sm mb-4">
                No classes or combinations match "{globalFilterValue}"
              </p>
              <button
                onClick={() => {
                  setGlobalFilterValue("");
                  setFilters({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredClasses.map((classItem) => {
              return (
                <AccordionTab key={classItem._id} header={
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {classItem.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{classItem.name}</div>
                      <div className="text-xs text-gray-500">
                        {filteredClasses.length === 1 ? 
                          `${classItem.combinations?.length || 0} combinations` : 
                          `${classItem.combinations?.length || 0} combinations`
                        }
                      </div>
                    </div>
                  </div>
                }>
                {Array.isArray(classItem.combinations) && classItem.combinations.length > 0 ? (
                  <div className="space-y-6 p-6">
                    {classItem.combinations.map((comb) => (
                      <div key={comb._id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {comb.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{comb.name}</h3>
                              <p className="text-sm text-gray-600">Combination</p>
                            </div>
                          </div>
                          <Button
                            label="Add Lesson"
                            icon="pi pi-plus"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                            onClick={() => showModal({ ...classItem, combination: comb })}
                          />
                        </div>
                        
                        {/* Timetable Content */}
                        {comb.timetable && comb.timetable.length > 0 ? (
                          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <Timetable timetableData={comb.timetable} combinationId={comb._id} />
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-gray-900 font-semibold mb-2">No Timetable Set</h3>
                            <p className="text-gray-500 text-sm mb-4">This combination doesn't have any lessons scheduled yet.</p>
                            <Button
                              label="Add First Lesson"
                              icon="pi pi-plus"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 rounded-lg font-medium"
                              onClick={() => showModal({ ...classItem, combination: comb })}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-semibold mb-2">No Combinations Found</h3>
                    <p className="text-gray-500 text-sm">This class doesn't have any combinations yet.</p>
                  </div>
                )}
              </AccordionTab>
            );
          })
          )}
        </Accordion>
      </div>
    </div>


      {isModalVisible && (
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add New Lesson</h2>
                <p className="text-sm text-gray-500">Schedule a lesson for {selectedclass.combination?.name}</p>
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <AntButton key="cancel" onClick={handleCancel} className="px-6 py-2 rounded-lg">
              Cancel
            </AntButton>,
            <AntButton
              key="submit"
              type="primary"
              onClick={handleAddLesson}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 shadow-md"
              disabled={
                isNewDay
                  ? !newDay ||
                    !selectedCourse ||
                    !selectedTeacher ||
                    !startTime ||
                    !endTime ||
                    updateTimetableForCombinationMutation.isPending || assignTimetableToCombinationMutation.isPending
                  : !selectedDay ||
                    !selectedCourse ||
                    !selectedTeacher ||
                    !startTime ||
                    !endTime ||
                    updateTimetableForCombinationMutation.isPending || assignTimetableToCombinationMutation.isPending
              }
            >
              <span className="flex items-center gap-2">
                {updateTimetableForCombinationMutation.isPending || assignTimetableToCombinationMutation.isPending ? (
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
          className="custom-modal"
        >
          <div className="space-y-6">
            {/* Day Selection */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Day Selection
              </label>
              <div className="flex gap-3">
                <AntButton
                  type={isNewDay ? "primary" : "default"}
                  onClick={() => setIsNewDay(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isNewDay 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Day
                </AntButton>
                <AntButton
                  type={!isNewDay ? "primary" : "default"}
                  onClick={() => setIsNewDay(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    !isNewDay 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Existing Day
                </AntButton>
              </div>
            </div>

                        {/* Day Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {isNewDay ? "Select New Day" : "Select Existing Day"}
              </label>
              {isNewDay ? (
                <Select
                  placeholder="Choose a new day"
                  value={newDay || undefined}
                  onChange={(value) => setNewDay(value)}
                  className="w-full"
                  showSearch
                  allowClear
                >
                  {[
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
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
                  className="w-full"
                >
                  {[
                    ...new Set(selectedclass?.combination?.timetable?.map((row) => row.day)),
                  ].map((day) => (
                    <Select.Option key={day} value={day}>
                      {day}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </div>

            {/* Course Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Course
              </label>
              <Select
                placeholder="Select a course"
                value={selectedCourse || undefined}
                onChange={(value) => setSelectedCourse(value)}
                className="w-full"
                showSearch
                allowClear
              >
                {courses && courses.length > 0 && courses.map((course) => (
                  <Select.Option key={course._id} value={course.name}>
                    {course?.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Teacher Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Teacher
              </label>
              <Select
                placeholder="Select a teacher"
                value={selectedTeacher || undefined}
                onChange={(value) => setSelectedTeacher(value)}
                className="w-full"
                showSearch
                allowClear
              >
                {courses && courses.length > 0 && selectedCourse &&
                  courses
                    .find((course) => course?.name === selectedCourse)
                    ?.teacherIds?.map((teacher) => (
                      <Select.Option
                        key={teacher._id}
                        value={teacher._id}
                        className="capitalize"
                      >
                        {`${teacher.firstName} ${teacher.lastName}`}
                      </Select.Option>
                    ))}
              </Select>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Time Schedule
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                  <TimePicker
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(value) => setStartTime(value)}
                    format="h:mm A"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">End Time</label>
                  <TimePicker
                    placeholder="End Time"
                    value={endTime}
                    onChange={(value) => setEndTime(value)}
                    format="h:mm A"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .custom-accordion .p-accordion-header-link {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .custom-accordion .p-accordion-header-link:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .custom-accordion .p-accordion-header-link.p-highlight {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-color: #3b82f6;
        }
        
        .custom-accordion .p-accordion-content {
          background: transparent;
          border: none;
          padding: 0;
        }
        
        .custom-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        
        .custom-modal .ant-modal-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 24px;
        }
        
        .custom-modal .ant-modal-body {
          padding: 24px;
        }
        
        .custom-modal .ant-modal-footer {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 16px 24px;
        }
      `}</style>
    </div>
  );
};
