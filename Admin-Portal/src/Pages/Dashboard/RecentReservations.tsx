import React, { useEffect, useState } from "react";

interface Reservation {
  id: number;
  publisher: string;
  stall: string;
  size: string;
  date: string;
}

const RecentReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch("/src/data/reservations.json")
      .then((res) => res.json())
      .then((json) => setReservations(json))
      .catch((err) => console.error("Error loading reservations:", err));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-3">Recent Reservations</h3>
      {reservations.length === 0 ? (
        <p className="text-gray-500 text-sm">No reservations found.</p>
      ) : (
        <ul>
          {reservations.map((r) => (
            <li key={r.id} className="flex justify-between border-b py-2 text-sm">
              <span>{r.publisher}</span>
              <span>{r.stall}</span>
              <span className="text-gray-500">{r.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentReservations;
