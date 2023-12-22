// Import Axios at the top of your file
import axios from 'axios';

// Create a function to fetch data from the endpoint
const getOGBook = async () => {
    try {
        // Define the request body
        const requestBody = {
            "insc": {
                "words": ["og"]
            }
        }

        // Make a POST request with the request body
        const response = await axios.post('https://ordinals.gorillapool.io/api/market?limit=1000&offset=0', requestBody);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Assuming the data you provided is an array of objects
            const responseData = response.data;

            // Now you can work with the responseData as needed
            //console.log(responseData);

            // Return the data if needed
            return responseData;
        } else {
            console.error('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Export the getHodlBook function without calling it
export default getOGBook;
