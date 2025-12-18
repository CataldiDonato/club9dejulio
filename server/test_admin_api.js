const axios = require('axios');

const test = async () => {
    try {
        // 1. Login as Admin (Juan Perez)
        const loginRes = await axios.post('http://localhost:3000/api/login', {
            dni: '111111', 
            password: '1234'
        });
        const token = loginRes.data.token;
        console.log("Login successful. Token obtained.");

        // 2. Fetch Users
        const usersRes = await axios.get('http://localhost:3000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("Users fetched:", usersRes.data.length);
        const pending = usersRes.data.filter(u => u.account_status === 'pending');
        console.log("Pending users found:", pending.length);
        console.log(JSON.stringify(pending, null, 2));

    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
    }
};

test();
