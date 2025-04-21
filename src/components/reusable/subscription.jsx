import React from 'react'
import { CircleChevronRight } from 'lucide-react'
export const Subscription = ({plan, index}) => {
  return (
      <div className='text-gray-600 border relative border-navy-800 border-opacity-85 rounded-2xl flex flex-col justify-between'>
       {plan?.isActive && <div className='absolute py-1 top-[-0.8rem] right-1/3 w-40 bg-gradient-to-br from-navy-800 to-gray-300 rounded-lg flex justify-center items-center'>
        <h1 className='text-white text-sm font-normal'>Active</h1>
       </div>}
        <div
          key={index}
          className={`rounded-2xl p-6 h-full flex flex-col justify-between bg-white pt-10`}
        >
          <div className="mb-4">
            <div className="flex gap-10 items-center">
              <h2 className="text-2xl font-bold">{plan.name}</h2>
                <span className="text-sm bg-navy-800 text-white px-2 py-1 rounded-full">
                  {plan.duration} months
                </span>
            </div>

            <div className="mt-4">
              <p className="text-3xl font-bold flex items-center">
                ${plan.price}
                <span className="text-sm text-gray-500 ml-1 font-normal">/{plan.planType} (USD)</span>
              </p>
            </div>
            <hr className="my-4 border-gray-200" />
            <ul className="mt-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-[12px]">
                  <CircleChevronRight className='text-gray-400 '/>
                  <span className="ml-2">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

         { <button
            className={`mt-6 py-2 rounded-xl font-semibold ${
              plan.isActive
                ? "border-navy-800 border text-black hover:bg-gray-200"
                : "bg-navy-900 text-white hover:bg-gray-800"
            }`}
          >
            {plan.button}
          </button>}
        </div>
    </div>
  );
}
