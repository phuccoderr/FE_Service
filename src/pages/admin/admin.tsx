import { revenueApi } from "@/api/revenue/revenue.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Button } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Period = "30days" | "6months" | "1year";
export default function Admin() {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const [period, setPeriod] = useState<Period>("30days");
  const { data } = useQuery({
    queryKey: [TANSTACK_KEY.REVENUE, period],
    queryFn: () => revenueApi.getByPeriod({ period }),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (data) {
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Doanh thu",
              data: data.data,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              tension: 0.3,
            },
          ],
        });
      }
    };

    fetchData();
  }, [period]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Biểu đồ doanh thu ${
          period === "30days"
            ? "30 ngày qua"
            : period === "6months"
            ? "6 tháng qua"
            : "1 năm qua"
        }`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Doanh thu (VNĐ)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
    },
  };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
  };
  return (
    <div className="revenue-chart-container p-2">
      <div className="period-selector">
        <Button
          className={period === "30days" ? "active" : ""}
          onClick={() => handlePeriodChange("30days")}
        >
          30 ngày qua
        </Button>
        <Button
          className={period === "6months" ? "active" : ""}
          onClick={() => handlePeriodChange("6months")}
        >
          6 tháng qua
        </Button>
        <Button
          className={period === "1year" ? "active" : ""}
          onClick={() => handlePeriodChange("1year")}
        >
          1 năm qua
        </Button>
      </div>
      <div className="chart-wrapper">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
