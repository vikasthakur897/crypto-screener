'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from 'lightweight-charts';

import { convertOHLCData } from '@/lib/utils';
import { fetcher } from '@/lib/coingecko.action';
import {
  getChartConfig,
  getCandlestickConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/lib/constants';

const toSeconds = (data: OHLCData[]): OHLCData[] =>
  data.map(
    ([t, o, h, l, c]) =>
      [Math.floor(t / 1000), o, h, l, c] as OHLCData
  );

const CandlestickChart = ({
  children,
  data = [],
  coinId,
  height = 360,
  initialPeriod = 'daily',
  liveOhlcv = null,
  mode = 'historical',
}: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef =
    useRef<ISeriesApi<'Candlestick'> | null>(null);

  const prevLength = useRef<number>(data.length);

  const [period, setPeriod] =
    useState<Period>(initialPeriod);
  const [ohlcData, setOhlcData] =
    useState<OHLCData[]>(data);

  const [, startTransition] = useTransition();

  // ✅ FIXED: valid OHLC fetch (NO interval)
  const fetchOHLCData = async (p: Period) => {
    try {
      const { days } = PERIOD_CONFIG[p];

      const result = await fetcher<OHLCData[]>(
        `/coins/${coinId}/ohlc`,
        {
          vs_currency: 'usd',
          days, // MUST be string
          precision: 'full',
        }
      );

      startTransition(() => {
        setOhlcData(result ?? []);
      });
    } catch (err) {
      console.error('Failed to fetch OHLC', err);
    }
  };

  // ✅ Chart init (only on period / height)
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const showTime = ['daily', 'weekly', 'monthly'].includes(
      period
    );

    const chart = createChart(
      chartContainerRef.current,
      {
        ...getChartConfig(height, showTime),
        width: chartContainerRef.current.clientWidth,
      }
    );

    const series = chart.addSeries(
      CandlestickSeries,
      getCandlestickConfig()
    );

    chartRef.current = chart;
    candleSeriesRef.current = series;

    chart.timeScale().fitContent();

    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        chart.applyOptions({
          width: entries[0].contentRect.width,
        });
      }
    });

    observer.observe(chartContainerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [height, period]);

  // ✅ Data + live candle merge (FIXED)
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const merged = toSeconds(ohlcData);

    if (liveOhlcv) {
      const live = toSeconds([liveOhlcv])[0];
      const last = merged[merged.length - 1];

      if (last && last[0] === live[0]) {
        merged[merged.length - 1] = live;
      } else {
        merged.push(live);
      }
    }

    merged.sort((a, b) => a[0] - b[0]);

    candleSeriesRef.current.setData(
      convertOHLCData(merged)
    );

    if (
      prevLength.current !== ohlcData.length ||
      mode === 'historical'
    ) {
      chartRef.current?.timeScale().fitContent();
      prevLength.current = ohlcData.length;
    }
  }, [ohlcData, liveOhlcv, mode]);

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>

        <div className="button-group">
          <span className="text-sm mx-2 font-medium text-purple-100/50">
            Period:
          </span>

          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={
                period === value
                  ? 'config-button-active'
                  : 'config-button'
              }
              onClick={() => {
                if (value !== period) {
                  setPeriod(value);
                  fetchOHLCData(value);
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={chartContainerRef}
        className="chart"
        style={{ height }}
      />
    </div>
  );
};

export default CandlestickChart;
