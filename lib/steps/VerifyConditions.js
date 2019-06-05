const axios = require('axios');

module.exports = async (pluginConfig, { logger }) => {
    const requiredEnvironmentVariables = [
        'SCS_USERNAME',
        'SCS_PASSWORD'
    ];

    const httpClient = axios.default.create({
        baseURL: pluginConfig.endpoint || 'https://api.shopware.com',
    })

    for (const index in requiredEnvironmentVariables) {
        const requiredEnvironmentVariable = requiredEnvironmentVariables[index];

        if (!process.env[requiredEnvironmentVariable]) {
            throw new Error(`Environment variable ${requiredEnvironmentVariable} is not set`);
        }
    }

    let response;

    try {
        response = await httpClient.post(`accesstokens`, {
            shopwareId: process.env['SCS_USERNAME'],
            password: process.env['SCS_PASSWORD'],
        });
    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    throw new Error('The given credentials are not valid. Please check your environment variables.');
                default:
                    throw new Error(error.Message);
            }
        } else {
            throw new Error(error.Message);
        }
    }

    if (response.data.success !== undefined && response.data.success === false) {
        throw new Error('No valid credentials found!');
    }

    const accessToken = response.data['token'];

    try {
        await httpClient.delete(`accesstokens/${accessToken}`);
    } catch (error) {
        logger.log('Could not remove the access token');
    }
}
