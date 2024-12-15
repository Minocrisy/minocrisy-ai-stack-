import { FileConverter } from './file-converter';
import * as path from 'path';

export class DocHandler {
  /**
   * Safely updates a markdown file by first writing as txt
   */
  static async updateDoc(docPath: string, content: string): Promise<boolean> {
    try {
      // Ensure we're working with absolute paths
      const absolutePath = path.isAbsolute(docPath) ? docPath : path.resolve(docPath);

      // Get the directory and base name
      const dir = path.dirname(absolutePath);
      const baseName = path.basename(absolutePath, path.extname(absolutePath));

      // Create directory if it doesn't exist
      await require('fs/promises').mkdir(dir, { recursive: true });

      // Create temp txt path
      const tempPath = path.join(dir, `${baseName}.txt`);

      // Use FileConverter to safely write and convert
      await FileConverter.safeWrite(absolutePath, content);

      // Verify the content
      const verified = await FileConverter.verifyContent(absolutePath, content);

      return verified;
    } catch (error) {
      console.error('Error updating doc:', error);
      return false;
    }
  }

  /**
   * Example usage of updating documentation
   */
  static async example(): Promise<void> {
    const docContent = `# Example Documentation

## Section 1
This is an example of safely updating markdown files.

## Section 2
Using the FileConverter utility to:
1. Write as .txt first
2. Convert to .md
3. Verify content
4. Keep backup`;

    const success = await this.updateDoc('docs/example.md', docContent);
    console.log('Doc update success:', success);
  }
}

// Run example if called directly
if (require.main === module) {
  DocHandler.example().catch(console.error);
}
