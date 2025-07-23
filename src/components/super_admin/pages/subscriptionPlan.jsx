import React, { useState } from "react";
import { Button } from "primereact/button";
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

  return (
    <div className="px-2 md:px-5 py-2 min-h-screen bg-gray-50">
      <div>
        <DynamicBreadcrumb />
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-700">Subscription Plan</h1>
        <Button
          label="Add Plan"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <span className="pi pi-spin pi-spinner text-3xl text-blue-500" />
            <span className="text-blue-500 font-medium">Loading subscriptions...</span>
          </div>
        </div>
      ) : subscriptions?.length <= 0 ? (
        <div className="flex justify-center items-center h-64">
          <h1 className="text-2xl font-semibold text-gray-400">
            No subscription found
          </h1>
        </div>
      ) : (
        <div>
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-4">
            <PlanTable />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-flow-col gap-5 mt-8">
            {mappedPlans?.map((plan, index) => (
              <Subscription key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      )}

      {visible && (
        <AddSubscription onClose={() => setVisible(false)} visible={visible} />
      )}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};
