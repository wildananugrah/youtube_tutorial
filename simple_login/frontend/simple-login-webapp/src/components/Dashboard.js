import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Box } from '@material-ui/core'

const Dashboard = () => {

    const[userId, setUserid] = useState();

    useEffect(()=>{
        const token = window.localStorage.getItem('token');
        if(token == null || token == 'undefined')
        {
            window.location.href = "/";
        }
        
        const data = {
            "token": token
        }

        axios.post("http://localhost:3001/auth/verify", data).then((response) => {
            console.log(response);
            setUserid(response.data.userId);
        }).catch((error) => {
            console.log(error.response);
        });

    });

    const handleLogout = (e) => {
        e.preventDefault();
        window.localStorage.clear();
        window.location.href = "/";
    }

    return (
        <Container maxWidth="sm">
            <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}>
                    Click me to sign-out
            </Button>
            <Box mt={2} ></Box>
            { `your userId: ${userId}` }
        </Container>
    );
}

export default Dashboard;
