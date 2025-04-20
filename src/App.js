import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

  const addEntry = () => {
    if (date && weight) {
      const newEntry = { date, weight: parseFloat(weight) };
      setEntries([...entries, newEntry]);
      setDate("");
      setWeight("");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>DRD Fitness Progress Tracker</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="number"
          placeholder="Body Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={addEntry} style={{ padding: "5px 10px" }}>
          Add Entry
        </button>
      </div>

      <div>
        <h2>Progress Chart</h2>
        {entries.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={entries}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data yet. Add your first entry above!</p>
        )}
      </div>
    </div>
  );
}


