/**
 * Contains all fields for the plugin configuration
 */
export interface IPluginConfig {
    /**
     * Contains the URL to the Shopware Comunity Store
     */
    endpoint: string | undefined;

    /**
     * The file system which should be used
     */
    fileSystem: string | undefined;

    /**
     * When set to true, then version in the plugin.xml
     * will be updated to the newest version which was determined by semantic-release
     */
    shouldIncrementVersion: boolean;

    /**
     * When set to true the version will be released to
     * the Shopware Community Store
     *
     * @type {boolean}
     * @memberof IPluginConfig
     */
    shouldReleaseToSCS: boolean;
}
