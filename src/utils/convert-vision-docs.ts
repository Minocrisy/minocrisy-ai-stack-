import { DocHandler } from './doc-handler';
import * as fs from 'fs/promises';
import * as path from 'path';

async function convertVisionDocs() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const visionDir = path.join(projectRoot, 'docs/vision');

    // List of vision docs to convert
    const filesToConvert = [
      'quick-start.txt',
      'use-cases.txt',
      'architecture.txt',
      'development-guide.txt',
      'project-structure.txt'  // Added project structure doc
    ];

    for (const file of filesToConvert) {
      try {
        // Read txt content
        const txtPath = path.join(visionDir, file);
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

    console.log('Vision documentation conversion complete');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the conversion
convertVisionDocs().catch(console.error);
