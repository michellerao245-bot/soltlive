// src/components/CandleChart.jsx

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!data || data.length === 0) {
      setLoading(false);
      return;
    }

    try {
      // Remove old chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth || 600,
        height,

        layout: {
          background: { color: "#131722" },
          textColor: "#d1d4dc",
        },

        grid: {
          vertLines: { color: "#2a2f3a" },
          horzLines: { color: "#2a2f3a" },
        },

        rightPriceScale: {
          borderColor: "#2a2f3a",
        },

        timeScale: {
          borderColor: "#2a2f3a",
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartRef.current = chart;

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#22c55e",
        downColor: "#ef4444",
        borderUpColor: "#22c55e",
        borderDownColor: "#ef4444",
        wickUpColor: "#22c55e",
        wickDownColor: "#ef4444",
      });

      candleSeries.setData(data);

      chart.timeScale().fitContent();

      setLoading(false);
      setError("");

      const handleResize = () => {
        if (!chartRef.current || !chartContainerRef.current) return;

        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    } catch (err) {
      console.error(err);
      setError(err.message || "Chart Error");
      setLoading(false);
    }
  }, [data, height]);

  if (error) {
    return (
      <div
        className="w-full flex items-center justify-center bg-[#131722]"
        style={{ height }}
      >
        <span className="text-red-400">{error}</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center bg-[#131722]"
        style={{ height }}
      >
        <span className="text-gray-400">No chart data available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#131722] z-10">
          <div className="text-gray-400">Loading chart...</div>
        </div>
      )}

      <div
        ref={chartContainerRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default React.memo(CandleChart);