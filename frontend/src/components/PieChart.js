import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ startDate, endDate }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/expenses/pie-data-range?start=${startDate}&end=${endDate}`
      );
      const result = await response.json();

      if (result.success) {
        const labels = result.data.map((item) => item.category);
        const values = result.data.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ]
            }
          ]
        });
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (!chartData) return <p>Select date range to view expenses.</p>;

  return <Pie data={chartData} />;
}
