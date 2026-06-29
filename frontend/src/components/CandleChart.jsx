// src/components/CandleChart.jsx
import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandleChart = ({ data, height = 400, width = '100%' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
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

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    // Volume series (optional)
    const volumeSeries = chart.addHistogramSeries({
      color: '#2a2f3a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });

    // Set data
    if (data && data.length > 0) {
      candleSeries.setData(data);
      
      // Generate volume data (mock if not available)
      const volumeData = data.map(item => ({
        time: item.time,
        value: Math.floor(Math.random() * 1000000) + 500000,
        color: item.close >= item.open ? '#22c55e' : '#ef4444',
      }));
      volumeSeries.setData(volumeData);
    }

    // Handle resize
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
  }, [data, height]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full rounded-lg overflow-hidden bg-[#131722] border border-gray-800"
      style={{ height: height }}
    />
  );
};

export default React.memo(CandleChart);