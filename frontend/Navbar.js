import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav>
            <a href="/home">Home</a>
            {userType === 'buyer' && <>
                <a href="/buy">Buy</a>
                <a href="/orders">Your Orders</a>
                <a href="/cart">Cart</a>
            </>}
            {userType === 'seller' && <>
                <a href="/sell">Sell</a>
            </>}
            <a href="/profile">Profile</a>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
