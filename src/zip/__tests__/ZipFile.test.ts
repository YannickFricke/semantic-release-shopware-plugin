import { ZipFile } from "../ZipFile";
import { resolve } from "path";
import { existsSync } from "fs";

const workingDirectory = resolve('src', '__mocks__');

describe('ZipFile', () => {
    let zipFile: ZipFile;

    beforeEach(() => {
        zipFile = new ZipFile(
            workingDirectory
        );
    });

    it('should be instantiable', () => {
        expect(zipFile).toBeInstanceOf(ZipFile);
    });

    it('should be instantiated with the current working directory', () => {
        expect(zipFile.rootDirectory).toEqual(workingDirectory);
    });

    it('should pack a zip file', async () => {
        const version = '1.0.0';
        zipFile.packZip(version);
        const zipFileExists = existsSync(`${zipFile.determineFolderName()}-${version}.zip`);

        expect(zipFileExists).toBeTruthy();
    });

    describe('File list', () => {
        it('should generate a list of files to archive', () => {
            const files = zipFile.generateFileList();

            expect(files.length).toBeGreaterThan(0);
        });

        it('should generate a list of files to archive and should not throw an error', () => {
            expect(() => {
                zipFile.generateFileList();
            }).not.toThrow();
        });
    });
});
