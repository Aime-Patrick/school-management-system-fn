import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const themeColors = [
  { name: "white", value: "#FFFFFF" },
  { name: "navy", value: "#1a237e" },
  { name: "red", value: "#DC143C" },
  { name: "purple", value: "#663399" },
  { name: "indigo", value: "#4B0082" },
  { name: "black", value: "#000000" },
  { name: "orange", value: "#FFA500" },
  { name: "yellow", value: "#FFD700" },
  { name: "pink", value: "#FF69B4" },
  { name: "gray", value: "#808080" },
  { name: "cyan", value: "#00CED1" },
  { name: "magenta", value: "#FF00FF" },
];

const chartData = {
  labels: ["2015", "2016", "2017", "2018", "2019", "2020"],
  datasets: [
    {
      label: "Approved",
      data: [20, 25, 35, 45, 35, 25],
      borderColor: "#4CAF50",
      tension: 0.4,
    },
    {
      label: "Submitted",
      data: [15, 30, 25, 40, 30, 20],
      borderColor: "#2196F3",
      tension: 0.4,
    },
  ],
};

export function LineChart({ data }) {
  return <Line options={options} data={data} />;
}

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "preferences", label: "Preferences" },
  { key: "analytics", label: "Analytics" },
  // Add more tabs as needed
];

export function SaAccountSettings({ onBack }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themeColors[0].value);

  // Apply selected theme color to the document root
  useEffect(() => {
    document.documentElement.style.setProperty('--system-theme-color', selectedTheme);
  }, [selectedTheme]);

  return (
    <div className="w-full p-6 md:p-10 space-y-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-navy-800">Account Settings</h1>
        {onBack && (
          <button
            onClick={onBack}
            className="text-navy-600 hover:text-navy-800 px-4 py-2 rounded transition"
          >
            Back
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b mb-8">
        <nav className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 text-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-600 text-blue-700"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold mb-2 text-navy-700">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-medium text-navy-800">Name, Location, Role</h3>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-medium text-navy-800">Theme mode</h3>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-600">Light</span>
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="toggle toggle-primary"
                  />
                  <span className="text-sm text-gray-600">Dark</span>
                </label>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-medium text-navy-800">Data and Privacy</h3>
                  <p className="text-sm text-gray-500">Manage your data preferences</p>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-medium">Manage</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* General Preferences */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold mb-2 text-navy-700">General Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-medium text-navy-800">Language</h3>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
                <select defaultValue="en" className="border p-2 rounded bg-white">
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className="p-5 bg-gray-50 rounded-xl border shadow-sm">
                <h3 className="font-medium mb-3 text-navy-800">Theme Color</h3>
                <div className="flex flex-wrap gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                        selectedTheme === color.value
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.value }}
                      aria-label={`Select ${color.name} theme`}
                      onClick={() => setSelectedTheme(color.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "analytics" && (
        <section className="p-6 bg-white rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-navy-800">Claims Over the Years</h3>
          <div className="h-[300px]">
            <LineChart data={chartData} />
          </div>
        </section>
      )}
    </div>
  );
}

export default SaAccountSettings;
