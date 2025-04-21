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
    <div className="px-5 py-2">
      <div>
        <DynamicBreadcrumb />
      </div>
      <div className="w-full flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-400">
          Subscription Plan
        </h1>
        <Button
          label="Add Plan"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
          className="bg-navy-800 text-white btn text-sm focus:outline-none focus:ring-0"
        />
      </div>
      {subscriptions?.length === 0 && isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-semibold text-gray-400">
            No subscription found
          </h1>
        </div>
      ) : (
        <div>
          <div className="w-full flex justify-between items-center mt-5">
            <PlanTable />
          </div>

          <div className="grid lg:grid-flow-col gap-5 mt-8">
            {mappedPlans?.map((plan, index) => (
              <Subscription key={index} plan={plan} index={index} />
            ))}
          </div>
        </div>
      )}
      {visible && (
        <AddSubscription onClose={() => setVisible(false)} visible={visible} />
      )}
    </div>
  );
};
