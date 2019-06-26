import { IPluginConfig } from "../../config/IPluginConfig";
import { resolve } from "path";

const publishFunction = require('../Publish');

describe('Publish tests', () => {
    let pluginConfiguration: IPluginConfig;
    let args: any;
    let logMock: any;

    beforeEach(() => {
        pluginConfiguration = {
            shouldIncrementVersion: true,
            fileSystem: resolve(
                __dirname,
                '..',
                'in-memory-fs'
            ),
            endpoint: undefined,
        };

        logMock = jest.fn();

        args = {
            nextRelease: {
                version: '1.0.0',
                notes: '',
            },
            logger: {
                log: logMock,
            }
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
