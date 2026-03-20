import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Card } from './ui/Card';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PriceChart = ({ data, color = "#10B981" }) => {
    if (!data || data.length === 0) return null;

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'Price (₹/Qtl)',
                data: data.map(d => d.price),
                borderColor: color,
                backgroundColor: `${color}20`,
                borderWidth: 2,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#F3F4F6',
                bodyColor: '#F3F4F6',
                borderColor: 'rgba(75, 85, 99, 0.4)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `₹${context.parsed.y} per quintal`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    maxTicksLimit: 7
                }
            },
            y: {
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    callback: function (value) {
                        return `₹${value}`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <Card glass className="p-6 bg-white/70 dark:bg-gray-800/70 border-emerald-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Price Trend (30 Days)
            </h3>
            <div className="h-[300px]">
                <Line data={chartData} options={options} />
            </div>
        </Card>
    );
};

export default PriceChart;
