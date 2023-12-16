// Import Axios at the top of your file
import axios from 'axios';

// Create a function to fetch data from the endpoint
const getHodlBook = async () => {
    try {
        // Define the request body
        const requestBody = {
            insc: {
                json: {
                    id: "bfd3bfe2d65a131e9792ee04a2da9594d9dc8741a7ab362c11945bfc368d2063_1"
                }
            }
        };

        // Make a POST request with the request body
        const response = await axios.post('https://v3.ordinals.gorillapool.io/api/market', requestBody);

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            // Assuming the data you provided is an array of objects
            const responseData = response.data;

            // Now you can work with the responseData as needed
            console.log(responseData);

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
export default getHodlBook;
