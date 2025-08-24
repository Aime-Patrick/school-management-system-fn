import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";
import { DynamicBreadcrumb } from "../../Breadcrumb/DynamicBreadcrumb";
import { AddSubscription } from "../../Modal/addSubscriptionPlan";
import { Subscription } from "../../reusable/subscription";
import PlanTable from "../../reusable/PlanTable";
import { useSubscription } from "../../../hooks/useSubscription";

export const SubscriptionPlan = () => {
  const [visible, setVisible] = useState();
  const { subscriptions, isLoading } = useSubscription();

  const mappedPlans = subscriptions?.map((sub) => ({
    name: sub.planName,
    price: sub.planAmount,
    duration: sub.planDuration,
    planType: sub.planType,
    isActive: sub.isActive,
    features: sub.planContent,
    button: sub.isActive ? "Cancel" : "Start 7-days Free Trial",
  }));

  // Calculate statistics
  const totalPlans = subscriptions?.length || 0;
  const activePlans = subscriptions?.filter(sub => sub.isActive).length || 0;
  const inactivePlans = totalPlans - activePlans;

  return (
    <div className="px-4 md:px-6 py-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="mb-6">
        <DynamicBreadcrumb />
      </div>
      
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Plans</h1>
            <p className="text-gray-600 text-lg">Manage and monitor your subscription offerings</p>
          </div>
          <Button
            label="Create New Plan"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Plans</p>
                <p className="text-3xl font-bold text-gray-800">{totalPlans}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <i className="pi pi-list text-blue-600 text-xl"></i>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Active Plans</p>
                <p className="text-3xl font-bold text-green-600">{activePlans}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <i className="pi pi-check-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Inactive Plans</p>
                <p className="text-3xl font-bold text-orange-600">{inactivePlans}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <i className="pi pi-pause-circle text-orange-600 text-xl"></i>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <i className="pi pi-spin pi-spinner text-3xl text-blue-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Plans</h3>
            <p className="text-gray-500">Please wait while we fetch your subscription plans...</p>
          </div>
        </div>
      ) : subscriptions?.length <= 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <i className="pi pi-credit-card text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-3">No Subscription Plans</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't created any subscription plans yet. Start by creating your first plan to offer services to schools.
          </p>
          <Button
            label="Create Your First Plan"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Plan Table Section */}
          <Card className="bg-white border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Plan Overview</h3>
                  <p className="text-gray-600">Detailed view of all subscription plans</p>
                </div>
                <Badge value={totalPlans} severity="info" className="text-sm"></Badge>
              </div>
              <PlanTable />
            </div>
          </Card>

          {/* Plan Cards Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Plan Cards</h3>
                <p className="text-gray-600">Visual representation of your subscription plans</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mappedPlans?.map((plan, index) => (
                <div key={index} className="transform hover:scale-105 transition-all duration-300">
                  <Subscription plan={plan} index={index} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {visible && (
        <AddSubscription onClose={() => setVisible(false)} visible={visible} />
      )}
    </div>
  );
};
