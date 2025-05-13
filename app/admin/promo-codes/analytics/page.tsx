'use client';
import { useState, useEffect } from 'react';
import { PromoAnalyticsService, PromoCodeStats } from '@/app/services/promoAnalyticsService';
import { PromoCodeService } from '@/app/services/promoCodeService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DATE_RANGE_PRESETS = {
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'Last 90 Days': 90,
  'Last 180 Days': 180,
  'Last 365 Days': 365,
  'Custom': null,
};

export default function PromoAnalytics() {
  const [topPromoCodes, setTopPromoCodes] = useState<Array<{ promoCodeId: string; stats: PromoCodeStats }>>([]);
  const [selectedPromoCode, setSelectedPromoCode] = useState<string | null>(null);
  const [selectedStats, setSelectedStats] = useState<PromoCodeStats | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedPreset, setSelectedPreset] = useState('Last 30 Days');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const topCodes = await PromoAnalyticsService.getTopPerformingPromoCodes(10, startDate, endDate);
      setTopPromoCodes(topCodes);

      if (selectedPromoCode) {
        const stats = await PromoAnalyticsService.getPromoCodeStats(selectedPromoCode, startDate, endDate);
        setSelectedStats(stats);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoCodeSelect = async (promoCodeId: string) => {
    setSelectedPromoCode(promoCodeId);
    try {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const stats = await PromoAnalyticsService.getPromoCodeStats(promoCodeId, startDate, endDate);
      setSelectedStats(stats);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDatePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== 'Custom') {
      const days = DATE_RANGE_PRESETS[preset as keyof typeof DATE_RANGE_PRESETS];
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days!);
      setDateRange({
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      });
    }
  };

  const exportChart = (chartId: string, filename: string) => {
    const canvas = document.getElementById(chartId) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${filename}-${dateRange.start}-to-${dateRange.end}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Chart data for revenue comparison
  const revenueChartData = {
    labels: topPromoCodes.map(({ promoCodeId }) => promoCodeId),
    datasets: [
      {
        label: 'Revenue Generated',
        data: topPromoCodes.map(({ stats }) => stats.revenueGenerated),
        backgroundColor: 'rgba(176, 84, 255, 0.5)',
        borderColor: 'rgb(176, 84, 255)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for conversion rates
  const conversionChartData = {
    labels: topPromoCodes.map(({ promoCodeId }) => promoCodeId),
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: topPromoCodes.map(({ stats }) => stats.conversionRate),
        backgroundColor: 'rgba(84, 176, 255, 0.5)',
        borderColor: 'rgb(84, 176, 255)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for selected promo code metrics
  const selectedPromoChartData = selectedStats ? {
    labels: ['Total Uses', 'Unique Customers', 'Conversion Rate'],
    datasets: [
      {
        data: [
          selectedStats.totalUses,
          selectedStats.uniqueCustomers,
          selectedStats.conversionRate,
        ],
        backgroundColor: [
          'rgba(176, 84, 255, 0.5)',
          'rgba(84, 176, 255, 0.5)',
          'rgba(84, 255, 176, 0.5)',
        ],
        borderColor: [
          'rgb(176, 84, 255)',
          'rgb(84, 176, 255)',
          'rgb(84, 255, 176)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Promo Code Analytics</h1>
        <div className="flex gap-4 items-center">
          <select
            value={selectedPreset}
            onChange={(e) => handleDatePresetChange(e.target.value)}
            className="border rounded p-2"
          >
            {Object.keys(DATE_RANGE_PRESETS).map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
          {selectedPreset === 'Custom' && (
            <>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="border rounded p-2"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="border rounded p-2"
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Revenue by Promo Code</h2>
            <button
              onClick={() => exportChart('revenueChart', 'revenue')}
              className="px-3 py-1 text-sm bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF]"
            >
              Export
            </button>
          </div>
          <Bar
            id="revenueChart"
            data={revenueChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Revenue Generated by Promo Code',
                },
              },
            }}
          />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Conversion Rates</h2>
            <button
              onClick={() => exportChart('conversionChart', 'conversion')}
              className="px-3 py-1 text-sm bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF]"
            >
              Export
            </button>
          </div>
          <Line
            id="conversionChart"
            data={conversionChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Conversion Rate by Promo Code',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Top Performing Promo Codes</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPromoCodes.map(({ promoCodeId, stats }) => (
                  <tr
                    key={promoCodeId}
                    onClick={() => handlePromoCodeSelect(promoCodeId)}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      selectedPromoCode === promoCodeId ? 'bg-gray-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{promoCodeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${stats.revenueGenerated.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stats.conversionRate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedStats && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Selected Promo Code Details</h2>
              <button
                onClick={() => exportChart('selectedPromoChart', 'selected-promo')}
                className="px-3 py-1 text-sm bg-[#B054FF] text-white rounded hover:bg-[#9F2FFF]"
              >
                Export
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Uses</h3>
                  <p className="text-2xl font-bold">{selectedStats.totalUses}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Discount</h3>
                  <p className="text-2xl font-bold">${selectedStats.totalDiscount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                  <p className="text-2xl font-bold">{selectedStats.conversionRate.toFixed(1)}%</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Average Discount</h3>
                  <p className="text-2xl font-bold">${selectedStats.averageDiscount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Revenue Generated</h3>
                  <p className="text-2xl font-bold">${selectedStats.revenueGenerated.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unique Customers</h3>
                  <p className="text-2xl font-bold">{selectedStats.uniqueCustomers}</p>
                </div>
              </div>
              <div className="h-64">
                <Doughnut
                  id="selectedPromoChart"
                  data={selectedPromoChartData!}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      title: {
                        display: true,
                        text: 'Key Metrics Distribution',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 