// File: api.js

import axios from 'axios';

const getGlobalOrderBook = async () => {
  const url = "https://ordinals.gorillapool.io/api/market";
  const params = {
    sort: "recent",
    dir: "DESC",
    q: "",
    limit: 100000,
    offset: 0,
    type: "text",
    bsv20: false,
    text: ""
  };

  try {
    const response = await axios.get(url, { params });
    //console.log("Global orderbook: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching global orderbook: ", error);
    throw error;
  }
};

export default getGlobalOrderBook;
