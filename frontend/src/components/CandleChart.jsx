// src/components/CandleChart.jsx
import React, { useEffect, useRef, useState } from 'react';

const CandleChart = ({ data, height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadChart = async () => {
      try {
        // ✅ Dynamic import with correct path
        const module = await import('lightweight-charts');
        const createChart = module.createChart;

        if (!chartContainerRef.current || !createChart) return;

        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: height,
          layout: {
            background: { color: '#131722' },
            textColor: '#d1d4dc',
          },
          grid: {
            vertLines: { color: '#2a2f3a' },
            horzLines: { color: '#2a2f3a' },
          },
          crosshair: {
            mode: 0,
          },
          rightPriceScale: {
            borderColor: '#2a2f3a',
          },
          timeScale: {
            borderColor: '#2a2f3a',
            timeVisible: true,
            secondsVisible: false,
          },
        });

        chartRef.current = chart;

        // ✅ Add Candlestick Series
        const candleSeries = chart.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderDownColor: '#ef4444',
          borderUpColor: '#22c55e',
          wickDownColor: '#ef4444',
          wickUpColor: '#22c55e',
        });

        if (data && data.length > 0) {
          candleSeries.setData(data);
        }

        if (isMounted) {
          setIsLoaded(true);
        }

        const handleResize = () => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.resize(
              chartContainerRef.current.clientWidth,
              height
            );
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
        };
      } catch (error) {
        console.error('Chart loading error:', error);
        if (isMounted) {
          setIsLoaded(false);
        }
      }
    };

    loadChart();

    return () => {
      isMounted = false;
    };
  }, [data, height]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800"
      style={{ height: height }}
    >
      {!isLoaded && (
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          ⏳ Loading chart...
        </div>
      )}
    </div>
  );
};

export default React.memo(CandleChart);