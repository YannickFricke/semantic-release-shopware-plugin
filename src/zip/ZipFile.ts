import { create } from 'archiver';
import { createReadStream, createWriteStream, readdirSync, statSync } from 'fs';
import { sep } from 'path';

/**
 * Zip file
 *
 * @class
 * @author Yannick Fricke <https://github.com/YannickFricke>
 */
export class ZipFile {
    /**
     * A blacklist of not needed files / directories
     *
     * @memberof ZipFile
     */
    public readonly blacklist = [
        'node_modules',
    ];
    /**
     * Root directory of zip file
     */
    private readonly RootDirectory: string;

    /**
     * Creates an instance of zip file.
     * @param [rootDirectory] The base directory
     */
    constructor(
        rootDirectory: string = process.cwd(),
    ) {
        this.RootDirectory = rootDirectory;
    }

    /**
     * Gets root directory
     */
    public get rootDirectory(): string {
        return this.RootDirectory;
    }

    /**
     * Generates a file list based of the given directory
     * The root directory will be used when the given directory is an empty string
     */
    public generateFileList(directory: string = ''): string[] {
        const result: string[] = [];

        const directoryParts = directory.split(sep);
        const filteredDirectoryParts = directoryParts.filter((entry) => {
            return this.blacklist.includes(entry);
        });

        if (filteredDirectoryParts.length > 0) {
            return result;
        }

        if (directory === '') {
            directory = this.RootDirectory;
        }

        const directoryContents = readdirSync(directory);

        directoryContents.forEach((entry) => {
            const completePath = `${directory}/${entry}`;

            const entryStats = statSync(completePath);

            if (entryStats.isDirectory()) {
                result.push(
                    ...this.generateFileList(completePath),
                );
            } else {
                result.push(completePath);
            }
        });

        return result;
    }

    /**
     * Returns the directory name of the root directory
     *
     * @returns {string} The directory name
     */
    public determineFolderName(): string {
        let result = this.RootDirectory;

        if (result.includes(sep)) {
            const parts = this.RootDirectory.split(sep);

            result = parts[parts.length - 1];
        }

        return result;
    }

    /**
     * Creates a zip archive with the following pattern:
     * $NAME-$VERSION.zip
     *
     * @param newVersion The new version of the plugin
     */
    public packZip(newVersion: string) {
        const folderName = this.determineFolderName();
        const resultFileName = createWriteStream(`${folderName}-${newVersion}.zip`);
        const zipFile = create('zip');

        const filesToArchive = this.generateFileList();

        filesToArchive.forEach((file) => {
            zipFile.append(createReadStream(file), {
                name: file.substr(this.RootDirectory.length + 1),
            });
        });

        zipFile.pipe(resultFileName);
        zipFile.finalize();

        return zipFile;
    }
}
