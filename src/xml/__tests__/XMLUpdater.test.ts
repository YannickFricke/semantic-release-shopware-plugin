import { XMLUpdater } from '../XMLUpdater';
import { IPlugin } from '../IPlugin';
import { resolve } from "path";

const testPluginFile = resolve(
    process.cwd(),
    'plugin.xml'
);
const inMemoryFsPath = '../steps/in-memory-fs';

describe('XMLUpdater', () => {
    let xmlUpdater: XMLUpdater;

    beforeEach(() => {
        xmlUpdater = new XMLUpdater(
            testPluginFile,
            inMemoryFsPath,
        );
    });

    it('should be an instance of XMLUpdater', () => {
        expect(xmlUpdater instanceof XMLUpdater).toBeTruthy();
    });

    it('should decode the plugin file', () => {
        const result = xmlUpdater.decodePluginFile();

        expect(typeof result).toBe('object');
    });

    describe('Version', () => {
        it('should have a version of 0.0.0', () => {
            const decodedFile: IPlugin = xmlUpdater.decodePluginFile();

            expect(decodedFile.plugin.version).toEqual('0.0.0');
        });

        describe('Updating the version', () => {
            it('should throw an error when the plugin file is not decoded', () => {
                expect(() => {
                    xmlUpdater.updateVersion('1.0.0');
                }).toThrowError('The plugin file is not decoded!');
            });

            it('should update the version number with a given version', () => {
                // Set a new version number for testing
                const newVersion = '1.0.0';

                // Test if the old version equals to 0.0.0

                xmlUpdater.decodePluginFile();
                const result: IPlugin = xmlUpdater.updateVersion(newVersion);

                // Test if the new version is set

                expect(typeof result).toBe('object');
                expect(result.plugin.version).toEqual(newVersion);
            });
        });
    });


    describe('Property checks', () => {
        let result: IPlugin;

        beforeEach(() => {
            xmlUpdater = new XMLUpdater(
                testPluginFile,
                inMemoryFsPath,
            );
            result = xmlUpdater.decodePluginFile();
        });

        it('should have the MIT license', () => {
            expect(result.plugin.license).toBe('MIT');
        });

        it('should have Yannick Fricke as author', () => {
            expect(result.plugin.author).toBe('Yannick Fricke');
        });

        it('should have a compatibility', () => {
            expect(result.plugin.compatibility).toBeDefined();
            expect(result.plugin.compatibility.minVersion).toBe('5.3.0');
        });

        it('should have the copyright of Yannick Fricke', () => {
            expect(result.plugin.copyright).toBe('(c) by Yannick Fricke');
        });

        it('should have a link to the GitHub repository', () => {
            expect(result.plugin.link.startsWith('https://github.com')).toBe(true);
        });
    });
});
