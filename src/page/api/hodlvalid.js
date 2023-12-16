import React, { useEffect, useState } from 'react';
import axios from 'axios';

const YourComponent = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // Define your GraphQL query
        const query = `
      query {
        locations {
          id
          name
          // Add other fields you want to retrieve
        }
      }
    `;

        // Make the Axios POST request to the GraphQL API
        axios
            .post('https://api.hodlock.com/graphql', { query })
            .then((response) => {
                // Assuming the response data structure is { data: { locations: [...] } }
                setLocations(response.data.data.locations);
                console.log("GraphQL: ", response.data);
                console.log("Locations: ", locations);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {locations.map((location) => (
                    <li key={location.id}>{location.name}</li>
                    // Render other location fields as needed
                ))}
            </ul>
        </div>
    );
};

export default YourComponent;
