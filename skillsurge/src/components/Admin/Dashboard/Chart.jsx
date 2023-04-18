import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Legend
);

export const LineChart = ({ views = [], users = [], subscriptions = [] }) => {
  const labels = getLastYearMonths();
  const options = {
    tension: 0.2,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Yearly Views',
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Views',
        data: views,
        borderColor: 'rgba(107,70,193,0.5)',
        backgroundColor: 'rgba(107,70,193,1)',
      },

      {
        label: 'Users',
        data: users,
        borderColor: 'rgba(214,43,129,0.5)',
        backgroundColor: 'rgba(214,43,129,1)',
      },

      {
        label: 'Subscriptions',
        data: subscriptions,
        borderColor: 'rgba(0,255,0,0.5)',
        backgroundColor: 'rgba(0,255,0,1)',
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export const DoughnutChart = ({ users = [] }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const data = {
    labels: ['Subscribed', 'Not Subscribed'],
    datasets: [
      {
        label: 'Users',
        data: users,
        borderColor: ['rgb(62,12,171)', 'rgb(214,43,129)'],
        backgroundColor: ['rgba(62,12,171,0.3)', 'rgba(214,43,129,0.3)'],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
};

// Returns an array of 12 months starting from the previous month of the current date and ending with the current month.
function getLastYearMonths() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const currentMonth = new Date().getMonth();
  const lastYear = [];

  for (let i = currentMonth + 1; i < 12; i++) {
    lastYear.push(months[i]);
  }
  for (let i = 0; i < currentMonth + 1; i++) {
    lastYear.push(months[i]);
  }

  return lastYear;
}
getLastYearMonths();
