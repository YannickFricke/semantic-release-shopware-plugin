const axios = require('axios');
const SemanticReleaseError = require('@semantic-release/error');

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
            throw new SemanticReleaseError(
                `Environment variable "${requiredEnvironmentVariable}" is not set`,
                'ESCSINVALIDCREDS',
                'Please check your credentials in the environment variables'
            );
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
                    throw new SemanticReleaseError(
                        'Invalid credentials',
                        'ESCSINVALIDCREDS',
                        'Please check your credentials in the environment variables'
                    );
                default:
                    throw new SemanticReleaseError(
                        error.Message,
                        'ESCSUNKNOWNERR'
                    );
            }
        } else {
            throw new SemanticReleaseError(
                error.Message,
                'ESCSUNKNOWNERR'
            );
        }
    }

    if (response.data.success !== undefined && response.data.success === false) {
        throw new SemanticReleaseError(
            'Invalid credentials',
            'ESCSINVALIDCREDS',
            'Please check your credentials in the environment variables'
        );
    }

    const accessToken = response.data['token'];

    try {
        await httpClient.delete(`accesstokens/${accessToken}`);
    } catch (error) {
        logger.log('Could not remove the access token');
    }
}
