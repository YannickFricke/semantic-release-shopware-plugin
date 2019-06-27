/**
import { IChangelogEntry } from "./../../../..//src/xml/IChangelogEntry";
 * Defines a changelog entry in the plugin.xml
 *
 * @export
 * @interface IChangelogEntry
 */
export interface IChangelogEntry {
    /**
     * The version of the entry
     *
     * @type {string}
     * @memberof IChangelogEntry
     */
    version: string;

    /**
     * The changes for this version
     *
     * @type {(IChangelogEntryProperties | IChangelogEntryProperties[])}
     * @memberof IChangelogEntry
     */
    changes: IChangelogEntryProperties | IChangelogEntryProperties[];
}

/**
 * This interface describes the properties of a changelog entry
 *
 * @export
 * @interface IChangelogEntryProperties
 */
export interface IChangelogEntryProperties {
    /**
     * The language of the entry
     *
     * @type {string}
     * @memberof IChangelogEntryProperties
     */
    lang: string;

    /**
     * The content of the element
     *
     * @type {string}
     * @memberof IChangelogEntryProperties
     */
    $t: string;
}
