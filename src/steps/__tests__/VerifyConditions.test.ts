import { IPluginConfig } from '../../config/IPluginConfig';
import VerifyConditions from '../VerifyConditions';

describe('Verify conditions', () => {
    const pluginConfig: IPluginConfig = {
        endpoint: '',
        fileSystem: 'fs',
        shouldIncrementVersion: true,
    };

    let logger: any;

    beforeEach(() => {
        logger = jest.fn();
    });

    process.env.SCS_USERNAME = undefined;

    it('should throw an exception when the credentials are not given', async () => {
        expect.assertions(1);
        const step = VerifyConditions(pluginConfig, { logger });

        step.catch((e: Error) => {
            expect(e.message).toEqual('One of the required environment variables is not set');
        });
    });
});
