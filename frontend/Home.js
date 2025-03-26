import React from 'react';

const Home = () => {
    return (
        <div>
            <h2>Welcome to Marketplace</h2>
            <div className="options">
                <a href="/marketplace">Marketplace</a>
                <a href="/advice">Farming Advice</a>
                <a href="/prices">Market Prices</a>
            </div>
        </div>
    );
};

export default Home;
