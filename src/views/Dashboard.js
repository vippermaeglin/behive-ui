import React, { useState, useEffect } from 'react';
import { useAuth0 } from '../auth/AuthContext';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [gym, getGym] = useState();
    const { getTokenSilently } = useAuth0();

    const fetchData = async () => {
        const baseUrl = 'https://behive-fit.herokuapp.com/' || 'http://localhost:8080';
        const token = await getTokenSilently();

        const res = await fetch(`${baseUrl}/gym`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res
            .json()
            .then((json) => {
                getGym(json.people);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <h1> Dashboard </h1>
    );
};

export default Dashboard;