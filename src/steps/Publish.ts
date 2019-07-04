import { resolve } from 'path';
import { toJson, toXml } from 'xml2json';
import { IPluginConfig } from '../config/IPluginConfig';

// const error = require('@semantic-release/error');

let logger: any;

const PublishStep = (pluginConfig: IPluginConfig, args: any) => {
    logger = args.logger;

    const fs = require(pluginConfig.fileSystem || 'fs');
    const nextRelease = args.nextRelease;
    const nextVersion = nextRelease.version;
    const releaseNotes = nextRelease.notes.split('\n');
    const pluginFile = resolve(
        process.cwd(),
        'plugin.xml',
    );

    logger.log(`Pushing version ${process.cwd()}:${nextVersion} to the Shopware Community Store`);

    logger.log(pluginConfig);
    logger.log(nextRelease);
    logger.log(nextVersion);
    logger.log(releaseNotes);

    if (!fs.existsSync(pluginFile)) {
        throw new Error(`Could not find plugin.xml in '${process.cwd()}'`);
    }

    const pluginFileContents = fs.readFileSync(pluginFile);

    const result = JSON.parse(toJson(pluginFileContents));

    if (pluginConfig.shouldIncrementVersion === true) {
        result.plugin.version = nextVersion;
    }

    const plugin = result.plugin;
    const changelogEntries = plugin.changelog;
    const version = plugin.version;

    printElements(plugin);

    logger.log(result);
    logger.log(plugin);
    logger.log(version);
    logger.log(changelogEntries);

    fs.writeFileSync(pluginFile, toXml(result));

    changelogEntries.forEach((entry: any) => {
        logger.log(entry.changes);
    });

    return result;
};

const printElements = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        const entry = obj[key];
        if (typeof entry !== 'string') {
            return;
        }

        logger.log(`${key}: ${entry}`);
    });
};

module.exports = PublishStep;
export default PublishStep;
