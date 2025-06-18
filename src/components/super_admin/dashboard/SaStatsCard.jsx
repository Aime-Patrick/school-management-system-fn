import React from "react";
import PropTypes from "prop-types";

export const SaStatsCard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white shadow-sm rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-sm font-semibold ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <h3 className="text-base font-medium text-blue-900 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-blue-800 tracking-tight">{value}</p>
    </div>
  );
};

SaStatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.number,
  icon: PropTypes.element.isRequired,
};
