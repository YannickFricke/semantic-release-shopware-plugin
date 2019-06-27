import { create } from "archiver";
import { sep } from "path";
import { createWriteStream, createReadStream, readdirSync, statSync } from "fs";

export class ZipFile {
    private _rootDirectory: string;

    constructor(
        rootDirectory: string = process.cwd(),
    ) {
        this._rootDirectory = rootDirectory;
    }

    public get rootDirectory(): string {
        return this._rootDirectory;
    }

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

    public determineFolderName() {
        let result = this._rootDirectory;

        if (result.includes(sep)) {
            const parts = this._rootDirectory.split(sep);

            result = parts[parts.length - 1];
        }

        return result;
    }

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

