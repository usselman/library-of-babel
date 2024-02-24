import axios from 'axios';

const getGayFrogBook = async () => {

    try {
        const requestBody = {
            map: { collectionID: "Gay-Frogs" }
        }

        const response = await axios.post('https://ordinals.gorillapool.io/api/market?limit=100&offset=0', requestBody);

        if (response.status === 200) {
            const responseData = response.data;
            return responseData;
        } else {
            console.error('Request failed with status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

export default getGayFrogBook;
