import { DocHandler } from './doc-handler';
import * as fs from 'fs/promises';
import * as path from 'path';

async function convertServicesDocs() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const docsDir = path.join(projectRoot, 'docs/core');

    // List of txt files to convert
    const filesToConvert = [
      'services-implementation.txt',
      'consolidation-tasks.txt',
      'current-progress.txt'
    ];

    for (const file of filesToConvert) {
      try {
        // Read txt content
        const txtPath = path.join(docsDir, file);
        const content = await fs.readFile(txtPath, 'utf-8');

        // Create md path
        const mdPath = txtPath.replace('.txt', '.md');

        // Convert to markdown
        console.log(`Converting ${file} to markdown...`);
        const success = await DocHandler.updateDoc(mdPath, content);

        if (success) {
          console.log(`Successfully converted ${file}`);

          // Verify content
          const writtenContent = await fs.readFile(mdPath, 'utf-8');
          if (writtenContent === content) {
            console.log(`Content verification successful for ${file}`);
            // Only delete txt file if md file is verified
            await fs.unlink(txtPath);
            console.log(`Removed original txt file: ${file}`);
          } else {
            console.error(`Content verification failed for ${file}`);
          }
        } else {
          console.error(`Failed to convert ${file}`);
        }
      } catch (error) {
        console.error(`Error processing ${file}:`, error);
        // Continue with next file even if one fails
        continue;
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the conversion
convertServicesDocs().catch(console.error);
