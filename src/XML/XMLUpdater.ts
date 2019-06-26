import { IPlugin } from "./IPlugin";
import { toJson } from 'xml2json';

declare function require(name: string): any;

export class XMLUpdater {
    /**
     * Contains the path to the plugin.xml
     *
     * @type {string}
     * @memberof XMLUpdater
     */
    public pluginFile: string;

    /**
     * Contains the read body of the plugin as string
     *
     * @type {string}
     * @memberof XMLUpdater
     */
    public pluginFileContents: string;

    /**
     * The decoded plugin file contents
     *
     * @type {IPlugin}
     * @memberof XMLUpdater
     */
    public decodedPluginFileContents: IPlugin;

    /**
     * The filesystem which should be used
     * When the file system parameter is undefined
     * the 'fs' package will be used.
     *
     * @type {string}
     * @memberof XMLUpdater
     */
    public fileSystem: string;

    /**
     * Creates an instance of XMLUpdater.
     * @param {string} pluginFile The path to the plugin.xml
     * @param {string} fileSystem The filesystem to use. By default 'fs'
     * @memberof XMLUpdater
     */
    constructor(
        pluginFile: string,
        fileSystem: string,
    ) {
        this.pluginFile = pluginFile;
        this.pluginFileContents = '';
        this.decodedPluginFileContents = undefined;
        this.fileSystem = fileSystem || 'fs';
    }

    /**
     * Decodes the plugin file
     *
     * @returns The decoded data
     * @memberof XMLUpdater
     */
    decodePluginFile(): IPlugin {
        const fileSystem = require(this.fileSystem);

        this.pluginFileContents = fileSystem.readFileSync(
            this.pluginFile
        );

        this.decodedPluginFileContents = JSON.parse(
            toJson(
                this.pluginFileContents
            )
        );

        return this.decodedPluginFileContents as IPlugin;
    }

    /**
     * Updates the object to the given version
     *
     * @param {string} newVersion The new version to use
     * @throws When the plugin file is not decoded
     * @returns The updated decoded file contents
     * @memberof XMLUpdater
     */
    updateVersion(newVersion: string) {
        if (this.decodedPluginFileContents === undefined) {
            throw new Error('The plugin file is not decoded!');
        }

        this.decodedPluginFileContents.plugin.version = newVersion;

        return this.decodedPluginFileContents;
    }
}
