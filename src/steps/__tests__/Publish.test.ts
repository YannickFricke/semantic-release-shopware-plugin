import { resolve } from 'path';
import { IPluginConfig } from '../../config/IPluginConfig';
import publishFunction from '../Publish';

describe('Publish tests', () => {
    let pluginConfiguration: IPluginConfig;
    let args: any;
    let logMock: any;

    beforeEach(() => {
        pluginConfiguration = {
            endpoint: undefined,
            fileSystem: resolve(
                __dirname,
                '..',
                'in-memory-fs',
            ),
            shouldIncrementVersion: true,
            shouldReleaseToSCS: false,
        };

        logMock = jest.fn();

        args = {
            logger: {
                log: logMock,
            },
            nextRelease: {
                notes: '',
                version: '1.0.0',
            },
        };
    });

    it('should call the log mock', () => {
        publishFunction(pluginConfiguration, args);

        expect(logMock).toBeCalled();
    });
});
