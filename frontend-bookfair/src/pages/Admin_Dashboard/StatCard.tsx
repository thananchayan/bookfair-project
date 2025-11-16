import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
