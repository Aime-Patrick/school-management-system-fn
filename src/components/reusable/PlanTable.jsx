import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, PlusCircle, Edit, Trash } from "lucide-react";
import { Modal, Select } from "antd";
import { useSubscription } from "../../hooks/useSubscription";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dropdown } from "primereact/dropdown";
import { Save } from "lucide-react";
import {SaveOff} from "lucide-react";

const PlanTable = () => {
  const {
    subscriptions,
    isLoading,
    addSubscriptionFeature,
    deleteSubscriptionFeature,
    updateSubscription,
    deleteSubscription
  } = useSubscription();
  const [plans, setPlans] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  const planContent = [
    "student-management",
    "teacher-management",
    "attendance-tracking",
    "report-generation",
    "finance-module",
  ];

  const planTypeOptions = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      const mappedPlans = subscriptions.map((sub) => ({
        id: sub._id,
        name: sub.planName,
        price: sub.planAmount,
        duration: sub.planDuration,
        planType: sub.planType,
        isActive: sub.isActive,
        features: sub.planContent.reduce((acc, feature) => {
          acc[feature] = true;
          return acc;
        }, {}),
      }));

      const uniqueFeatures = Array.from(
        new Set(subscriptions.flatMap((sub) => sub.planContent))
      );

      setPlans(mappedPlans);
      setAllFeatures(uniqueFeatures);
    }
  }, [subscriptions]);

  const toggleFeature = (planIndex, featureKey) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureKey] =
      !updatedPlans[planIndex].features[featureKey];
    setPlans(updatedPlans);
    if (updatedPlans[planIndex].features[featureKey]) {
      addSubscriptionFeature({
        id: updatedPlans[planIndex].id,
        newContent: [featureKey],
      });
    } else {
      deleteSubscriptionFeature({
        id: updatedPlans[planIndex].id,
        newContent: [featureKey],
      });
    }
  };

  const handleAddFeature = (planIndex) => {
    setCurrentPlanIndex(planIndex);
    setIsModalVisible(true);
  };

  const handleAddFeatureConfirm = () => {
    if (selectedFeature && currentPlanIndex !== null) {
      addSubscriptionFeature({
        id: currentPlanIndex,
        newContent: selectedFeature,
      });
    }
    setIsModalVisible(false);
    setSelectedFeature(null);
    setCurrentPlanIndex(null);
  };

  const handleEditPlan = (planIndex) => {
    setCurrentPlan(plans[planIndex]);
    setIsEditModalVisible(true);
  };

  const handleEditPlanConfirm = (values) => {
    const updatedPlans = [...plans];
    const planIndex = plans.findIndex((plan) => plan.id === currentPlan.id);
    updatedPlans[planIndex] = { ...currentPlan, ...values };
    setPlans(updatedPlans);
    updateSubscription({
        id: currentPlan.id,
        planName: values.name,
        planAmount: values.price,
        planDuration: values.duration,
        planType: values.planType,
    })
    setIsEditModalVisible(false);
    setCurrentPlan(null);
  };

  const handleDeletePlan = (planIndex) => {
    deleteSubscription(planIndex);
  };

  const formik = useFormik({
    initialValues: {
      name: currentPlan?.name || "",
      duration: currentPlan?.duration || "",
      price: currentPlan?.price || "",
      planType: currentPlan?.planType || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Plan name is required"),
      duration: Yup.number()
        .required("Duration is required")
        .typeError("Duration must be a number"),
      price: Yup.number()
        .required("Price is required")
        .typeError("Price must be a number"),
        planType: Yup.string().required("Plan type is required"),
    }),
    onSubmit: handleEditPlanConfirm,
  });

  const renderCheck = (enabled, planIndex, featureKey) => (
    <button
      onClick={() => toggleFeature(planIndex, featureKey)}
      className="focus:outline-none"
    >
      {enabled ? (
        <CheckCircle className="text-navy-800 w-5 h-5 mx-auto" />
      ) : (
        <XCircle className="text-gray-400 w-5 h-5 mx-auto" />
      )}
    </button>
  );

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[800px] border border-gray-200 rounded-lg">
        <div className="grid grid-cols-4 text-center font-medium text-gray-700 border-b rounded-lg bg-white">
          <div className="py-4 bg-white"></div>
          {plans.map((plan, idx) => (
            <div key={idx} className="py-4 bg-white flex items-center gap-2">
              <div className="ml-5">
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.duration} months</p>
                <div className="text-2xl text-navy-800 mt-2">${plan.price}</div>
              </div>
              <div className="flex flex-col items-center">
                {/* Add New Feature */}
                <button
                  onClick={() => handleAddFeature(plan.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Add New Feature"
                >
                  <PlusCircle className="text-green-500 w-5 h-5" />
                </button>

                {/* Edit Plan */}
                <button
                  onClick={() => handleEditPlan(idx)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Edit Plan"
                >
                  <Edit className="text-blue-500 w-5 h-5" />
                </button>

                {/* Delete Plan */}
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  title="Delete Plan"
                >
                  <Trash className="text-red-500 w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {allFeatures.map((featureKey) => (
          <div
            key={featureKey}
            className="grid grid-cols-4 text-center border-b"
          >
            <div className="py-4 font-medium text-[12px] capitalize">
              {featureKey.replace(/-/g, " ")}
            </div>
            {plans.map((plan, idx) => (
              <div key={idx} className="py-4">
                {renderCheck(
                  plan.features[featureKey] || false,
                  idx,
                  featureKey
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal
        title="Add New Feature"
        open={isModalVisible}
        onOk={handleAddFeatureConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText={
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </span>
          } 
        okButtonProps={{
            style: { backgroundColor: "#1E3A8A", color: "#fff", border: "none" }, // Navy blue background with white text
          }}
          cancelButtonProps={{
            style: { color: "#1E3A8A" },
          }}
            cancelText={
                <span className="flex items-center gap-2">
                <SaveOff className="w-4 h-4" /> Cancel
                </span>
            }
      >
        <Select
          placeholder="Select a feature"
          mode="multiple"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedFeature(value)}
          options={planContent.map((feature) => ({
            label: feature.replace(/-/g, " "),
            value: feature,
          }))}
        />
      </Modal>

      {/* Modal for Editing Plan */}
      <Modal
        title="Edit Plan"
        open={isEditModalVisible}
        onOk={formik.handleSubmit}
        onCancel={() => setIsEditModalVisible(false)}
        okButtonProps={{
            style: { backgroundColor: "#1E3A8A", color: "#fff", border: "none" }, // Navy blue background with white text
          }}
          okText={
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </span>
          } 
          cancelButtonProps={{
            style: { color: "#1E3A8A" },
          }}
          cancelText={
            <span className="flex items-center gap-2">
              <SaveOff className="w-4 h-4" /> Cancel
            </span>
          }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          {/* Plan Name */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              />
              <label htmlFor="name">Plan Name</label>
            </FloatLabel>
            {formik.touched.name && formik.errors.name && (
              <small className="p-error">{formik.errors.name}</small>
            )}
          </div>
          {/* Plan Duration */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="duration"
                name="duration"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              />
              <label htmlFor="duration">Plan Duration (months)</label>
            </FloatLabel>
            {formik.touched.duration && formik.errors.duration && (
              <small className="p-error">{formik.errors.duration}</small>
            )}
          </div>
          {/* Plan Price */}
          <div className="py-2 mb-2">
            <FloatLabel>
              <InputText
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-500 p-2 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              />
              <label htmlFor="price">Plan Price ($)</label>
            </FloatLabel>
            {formik.touched.price && formik.errors.price && (
              <small className="p-error">{formik.errors.price}</small>
            )}
          </div>
          <div className="py-2">
            <FloatLabel>
              <Dropdown
                id="planType"
                name="planType"
                value={formik.values.planType}
                options={planTypeOptions}
                onChange={(e) => formik.setFieldValue("planType", e.value)}
                className="w-full border border-gray-500 rounded-md placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-gray-100"
              />
              <label htmlFor="planType">Plan type</label>
            </FloatLabel>
            {formik.touched.planType && formik.errors.planType && (
              <small className="p-error">{formik.errors.planType}</small>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlanTable;
