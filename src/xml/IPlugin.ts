export interface IPlugin {
    plugin: {
        author: string,
        changelog: [],
        compatibility: {
            minVersion: string,
        }
        copyright: string,
        license: string,
        link: string,
        version: string,
    }
}
