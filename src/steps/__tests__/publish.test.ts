import { resolve } from 'path';
import { IPluginConfig } from '../../config/IPluginConfig';

const publishFunction = require('../Publish');

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
        expect(logMock).toBeCalledWith(pluginConfiguration);
        expect(logMock).toBeCalledWith(args.nextRelease);
        expect(logMock).toBeCalledWith(args.nextRelease.version);
    });
});
