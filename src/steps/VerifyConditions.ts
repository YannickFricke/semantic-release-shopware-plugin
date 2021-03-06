import axios from 'axios';
import { IPluginConfig } from '../config/IPluginConfig';

const VerifyConditionsStep = async (pluginConfig: IPluginConfig, { logger }: any) => {
    const requiredEnvironmentVariables = [
        'SCS_USERNAME',
        'SCS_PASSWORD',
    ];

    const filtered = requiredEnvironmentVariables.filter((entry) => {
        return process.env[entry] === undefined;
    });

    if (filtered.length > 0) {
        throw new Error('One of the required environment variables is not set');
    }

    const httpClient = axios.create({
        baseURL: pluginConfig.endpoint || 'https://api.shopware.com',
    });

    let response;

    try {
        response = await httpClient.post('accesstokens', {
            password: process.env.SCS_PASSWORD,
            shopwareId: process.env.SCS_USERNAME,
        });
    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    throw new Error(
                        'Invalid credentials',
                    );
                default:
                    throw new Error(
                        error.Message,
                    );
            }
        } else {
            throw new Error(
                error.Message,
            );
        }
    }

    if (response.data.success !== undefined && response.data.success === false) {
        throw new Error(
            'Invalid credentials',
        );
    }

    const accessToken = response.data.token;

    try {
        await httpClient.delete(`accesstokens/${accessToken}`);
    } catch (error) {
        logger.log('Could not remove the access token');
    }
};

module.exports = VerifyConditionsStep;
export default VerifyConditionsStep;
