

appServer.get('/callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.send('Authorization failed.');
    }

    const clientId = '2b8a23451e5743778bd1d106443b8305';
    const clientSecret = '5aa61432cd964dd191c7728ce2a417bf';
    const redirectUri = `http://localhost:${port}/callback`;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = response.data;
        
        ipcMain.emit('access-token', access_token);

        res.send(`Access Token: ${access_token}`);
    } catch (error) {
        console.error('Error fetching access token:', error);
        res.send('Error fetching access token.');
    }
});

appServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
