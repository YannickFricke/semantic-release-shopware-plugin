const axios = require('axios');

module.exports = async (pluginConfig) => {
    const requiredEnvironmentVariables = [
        'SCS_USERNAME',
        'SCS_PASSWORD'
    ];

    const apiEndpoint = pluginConfig.endpoint || 'https://api.shopware.com';

    for (const index in requiredEnvironmentVariables) {
        const requiredEnvironmentVariable = requiredEnvironmentVariables[index];

        if (!process.env[requiredEnvironmentVariable]) {
            throw new Error(`Environment variable ${requiredEnvironmentVariable} is not set`);
        }
    }

    const response = await axios.post(`${apiEndpoint}/accesstokens`, {
        shopwareId: process.env['SCS_USERNAME'],
        password: process.env['SCS_PASSWORD'],
    });

    if (response.data.success !== undefined && response.data.success === false) {
        throw new Error('No valid credentials found!');
    }

    const accessToken = response.data['token'];

    await axios.delete(`https://api.shopware.com/accesstokens/${accessToken}`);
}
