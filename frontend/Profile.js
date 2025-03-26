import { useEffect } from 'react';

const fetchProfile = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Profile:', data);
    } catch (error) {
        console.error('Profile Error:', error.message);
    }
};

const Profile = () => {
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
        </div>
    );
};

export default Profile;
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    let userType = localStorage.getItem('userType');

    if (token) {
        fetchUserProfile(); // ✅ Load user profile
        if (window.location.pathname === '/index.html') {
            redirectToHome();
        }
    }
});