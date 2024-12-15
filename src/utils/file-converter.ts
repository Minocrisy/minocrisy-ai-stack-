import * as fs from 'fs/promises';
import * as path from 'path';

export class FileConverter {
  /**
   * Converts a file from one format to another while maintaining content
   */
  static async convertFile(sourcePath: string, targetFormat: string): Promise<string> {
    try {
      // Ensure we're working with absolute paths
      const absolutePath = path.isAbsolute(sourcePath) ? sourcePath : path.resolve(sourcePath);

      // Read source file
      const content = await fs.readFile(absolutePath, 'utf-8');

      // Get source format
      const sourceFormat = path.extname(absolutePath).slice(1);

      // Generate target path
      const targetPath = absolutePath.replace(
        new RegExp(`\\.${sourceFormat}$`),
        `.${targetFormat}`
      );

      // Ensure target directory exists
      await fs.mkdir(path.dirname(targetPath), { recursive: true });

      // Write to target format
      await fs.writeFile(targetPath, content, 'utf-8');

      // Create backup
      const backupPath = `${targetPath}.backup`;
      await fs.writeFile(backupPath, content, 'utf-8');

      return targetPath;
    } catch (error) {
      console.error('Error converting file:', error);
      throw error;
    }
  }

  /**
   * Safe write operation that first writes as .txt then converts to target format
   */
  static async safeWrite(targetPath: string, content: string): Promise<void> {
    try {
      // Ensure we're working with absolute paths
      const absolutePath = path.isAbsolute(targetPath) ? targetPath : path.resolve(targetPath);

      // Ensure directory exists
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });

      // First write as .txt
      const tempPath = absolutePath.replace(/\.[^.]+$/, '.txt');
      await fs.writeFile(tempPath, content, 'utf-8');

      // Convert to target format if different
      if (tempPath !== absolutePath) {
        await this.convertFile(tempPath, path.extname(absolutePath).slice(1));
        // Clean up temp file
        await fs.unlink(tempPath);
      }
    } catch (error) {
      console.error('Error in safe write:', error);
      throw error;
    }
  }

  /**
   * Verify file content after write
   */
  static async verifyContent(filePath: string, expectedContent: string): Promise<boolean> {
    try {
      // Ensure we're working with absolute paths
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

      const content = await fs.readFile(absolutePath, 'utf-8');
      return content === expectedContent;
    } catch (error) {
      console.error('Error verifying content:', error);
      return false;
    }
  }
}
