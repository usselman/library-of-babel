import axios from 'axios';

const getFrogBook = async () => {

    try {
        const requestBody = {
            map: { subTypeData: { collectionId: "b264f5e81f7c74057c691332e477c17f0ddc2f0cc024cb0f07b758533d1d3094_0" } }
        }

        const response = await axios.post('https://ordinals.gorillapool.io/api/market?limit=1000&offset=0', requestBody);

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

export default getFrogBook;
