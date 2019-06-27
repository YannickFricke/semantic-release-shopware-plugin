import { IChangelogEntry } from './IChangelogEntry';

export interface IPlugin {
    plugin: {
        author: string,
        changelog: IChangelogEntry | IChangelogEntry[],
        compatibility: {
            minVersion: string,
        }
        copyright: string,
        license: string,
        link: string,
        version: string,
    };
}
