import { create } from "archiver";
import { sep } from "path";
import { createWriteStream, createReadStream, readdirSync, statSync } from "fs";

/**
 * Zip file
 *
 * @class
 * @author Yannick Fricke <https://github.com/YannickFricke>
 */
export class ZipFile {
    /**
     * Root directory of zip file
     */
    private _rootDirectory: string;

    /**
     * Creates an instance of zip file.
     * @param [rootDirectory] The base directory
     */
    constructor(
        rootDirectory: string = process.cwd(),
    ) {
        this._rootDirectory = rootDirectory;
    }

    /**
     * Gets root directory
     */
    public get rootDirectory(): string {
        return this._rootDirectory;
    }

    /**
     * Generates a file list based of the given directory
     * The root directory will be used when the given directory is an empty string
     */
    public generateFileList(directory: string = ''): string[] {
        const result: string[] = [];

        if (directory === '') {
            directory = this._rootDirectory;
        }

        const directoryContents = readdirSync(directory);

        directoryContents.forEach(entry => {
            const completePath = `${directory}/${entry}`;

            const entryStats = statSync(completePath);

            if (entryStats.isDirectory()) {
                result.push(
                    ...this.generateFileList(completePath)
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
        let result = this._rootDirectory;

        if (result.includes(sep)) {
            const parts = this._rootDirectory.split(sep);

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

        filesToArchive.forEach(file => {
            zipFile.append(createReadStream(file), {
                name: file.substr(this._rootDirectory.length + 1),
            });
        });

        zipFile.pipe(resultFileName);
        zipFile.finalize();

        return zipFile;
    }
}
