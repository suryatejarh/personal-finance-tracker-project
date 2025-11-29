import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function LineChart({ startDate, endDate }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:5000/api/expenses/monthly-data-range?start=${startDate}&end=${endDate}`
      );
      const result = await res.json();

      if (result.success) {
        const raw = result.data;

        const months = [...new Set(raw.map((item) => item.month))];
        const categories = [...new Set(raw.map((item) => item.category))];

        const datasets = categories.map((cat) => ({
          label: cat,
          data: months.map(
            (m) => raw.find((d) => d.month === m && d.category === cat)?.total || 0
          ),
          borderWidth: 2,
          tension: 0.3
        }));

        setChartData({
          labels: months,
          datasets: datasets
        });
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (!chartData) return <p>Select date range to see trend.</p>;

  return <Line data={chartData} />;
}
