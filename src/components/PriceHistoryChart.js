import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const PriceHistoryChart = ({ data }) => {
    const [exchangeRate, setExchangeRate] = useState(0);

    useEffect(() => {
        async function getExchangeRate() {
            const url = 'https://api.whatsonchain.com/v1/bsv/main/exchangerate';
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                setExchangeRate(parseFloat(data.rate));
                console.log("Exchange rate fetched: ", exchangeRate);
            } catch (error) {
                console.error("Fetching exchange rate failed: ", error);
            }
        }

        getExchangeRate();
    }, []); // Fetch exchange rate when the component mounts

    // Extract values for height, price, and amount from each listing
    const heights = data.map((item) => item.height);
    const prices = data.map((item) => item.data.list.price);

    // Filter out null values (missing data points) from the data
    const filteredData = data.filter((item) => item.origin && item.origin.data && item.origin.data.insc);

    const amounts = filteredData.map((item) => {
        return parseFloat(item.origin.data.insc.json.amt);
    });

    // Calculate the price/amount ratio in USD
    const priceAmountRatioUSD = amounts.map((amt, index) => (amt / prices[index]) * exchangeRate);
    console.log("Prices: ", prices);
    const marketcap = (prices[0] * 21000) / 100000000 * exchangeRate;

    const chartData = {
        labels: heights.map(String), // Convert heights to strings for the X-axis (category)
        datasets: [
            {
                label: 'Price per Token',
                data: priceAmountRatioUSD, // Y-axis data (amount/price in USD)
                fill: false,
                backgroundColor: 'white',
                borderColor: 'green',
                pointRadius: 2, // Set point radius
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
                },
            },
            y: {
                beginAtZero: false, // Start the y-axis at zero
                title: {
                    display: true,
                    text: 'Price per token (USD)',
                },
                ticks: {
                    callback: (value) => `$${value.toFixed(4)}`, // Add '$' symbol and format to 2 decimal places
                },
            },
        },
    };

    return (
        <div>
            <h1 className="text-2xl font-bold">Marketcap: ${marketcap.toFixed(0)}</h1>
            <h2 className="font-bold">Listing Price History (USD) - WIP</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PriceHistoryChart;
