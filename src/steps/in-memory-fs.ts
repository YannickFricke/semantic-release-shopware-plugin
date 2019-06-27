import { readFileSync } from 'fs';
import { resolve } from 'path';

const pluginXmlPath = resolve(
    process.cwd(),
    'plugin.xml',
);

const fileSystem: any = {};

fileSystem[pluginXmlPath] = readFileSync(
    resolve(
        __dirname,
        '..',
        '__mocks__',
        'plugin.xml',
    ),
);

module.exports = {
    existsSync: (fileName: string) => fileSystem[fileName] !== undefined,
    readFileSync: (fileName: string) => fileSystem[fileName],
    writeFileSync: (fileName: string, content: string) => fileSystem[fileName] = content,
};
