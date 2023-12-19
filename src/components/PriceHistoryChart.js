import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PriceHistoryChart = ({ data }) => {
    // Extract values for height, price, and amount from each listing
    const heights = data.map((item) => item.height);
    const prices = data.map((item) => item.data.list.price);

    // Filter out null values (missing data points) from the data
    const filteredData = data.filter((item) => item.origin && item.origin.data && item.origin.data.insc);

    const amounts = filteredData.map((item) => {
        return parseFloat(item.origin.data.insc.json.amt);
    });

    const chartData = {
        labels: heights.map(String), // Convert heights to strings for the X-axis (category)
        datasets: [
            {
                label: 'Price/Amount History',
                data: amounts.map((amt, index) => amt / prices[index]), // Y-axis data (amount/price)
                fill: true,
                borderColor: 'blue',
                pointRadius: 3, // Set point radius
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'category', // Specify x-axis as "category"
                position: 'bottom',
                reverse: true, // Reverse the x-axis
                title: {
                    display: true,
                    text: 'Block Height',
                }
            },
            y: {
                beginAtZero: false, // Start the y-axis at zero
                title: {
                    display: true,
                    text: 'Price/Amount',
                },
            },
        },
    };

    return (
        <div>
            <h2>Listing Price History (WIP)</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PriceHistoryChart;
