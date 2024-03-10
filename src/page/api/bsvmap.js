// File: api.js

import axios from 'axios';

const getBSVMapBook = async () => {
    const url = "https://ordinals.gorillapool.io/api/market";
    const params = {
        sort: "recent",
        dir: "DESC",
        q: "eyJpbnNjIjp7IndvcmRzIjpbImJzdm1hcCJdfX0",
        limit: 1000,
        offset: 0,
        type: "text",
        bsv20: false,
        text: ""
    };

    try {
        const response = await axios.get(url, { params });
        console.log("BSVMap orderbook: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching global orderbook: ", error);
        throw error;
    }
};

export default getBSVMapBook;
