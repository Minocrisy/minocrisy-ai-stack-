import { DocHandler } from './doc-handler';
import * as fs from 'fs/promises';
import * as path from 'path';

async function convertBrowserTesting() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const txtPath = path.join(projectRoot, 'docs/guides/environment/browser-testing.txt');
    const mdPath = path.join(projectRoot, 'docs/guides/environment/browser-testing.md');

    // Read txt content
    const content = await fs.readFile(txtPath, 'utf-8');

    // Convert to markdown
    console.log('Converting browser-testing.txt to markdown...');
    const success = await DocHandler.updateDoc(mdPath, content);

    if (success) {
      console.log('Successfully converted browser-testing documentation');

      // Verify content
      const writtenContent = await fs.readFile(mdPath, 'utf-8');
      if (writtenContent === content) {
        console.log('Content verification successful');
        // Only delete txt file if md file is verified
        await fs.unlink(txtPath);
        console.log('Removed original txt file');
      } else {
        console.error('Content verification failed');
      }
    } else {
      console.error('Failed to convert browser-testing documentation');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the conversion
convertBrowserTesting().catch(console.error);
