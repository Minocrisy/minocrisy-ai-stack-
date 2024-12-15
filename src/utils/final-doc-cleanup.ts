import { promises as fs } from 'fs';
import * as path from 'path';

async function finalCleanup() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const docsDir = path.join(projectRoot, 'docs');

    // 1. Handle browser-testing duplicate
    const browserTestingTxt = path.join(docsDir, 'guides/environment/browser-testing.txt');
    try {
      await fs.unlink(browserTestingTxt);
      console.log('Removed duplicate browser-testing.txt');
    } catch (error) {
      console.log('Note: browser-testing.txt already removed');
    }

    // 2. Move remaining improvements files to appropriate locations
    const moves = [
      // Move to core
      ['improvements/consolidation-tasks.md', 'core/consolidation-tasks.md'],
      ['improvements/current-progress.txt', 'core/current-progress.txt'],
      ['improvements/doc-reorganization.txt', 'core/doc-reorganization.txt'],

      // Move to guides/development
      ['improvements/file-operations.md', 'guides/development/file-operations.md'],

      // Move to core
      ['improvements/index.md', 'core/index.md'],

      // Move to guides/development
      ['improvements/security-guidelines.md', 'guides/development/security-guidelines.md'],

      // Move to guides/development
      ['improvements/agent-integration.md', 'guides/development/agent-integration.md']
    ];

    // Process moves
    for (const [src, dest] of moves) {
      try {
        const sourcePath = path.join(docsDir, src);
        const destPath = path.join(docsDir, dest);

        // Read source content
        const content = await fs.readFile(sourcePath, 'utf-8');

        // Write to new location
        await fs.writeFile(destPath, content, 'utf-8');
        console.log(`Moved ${src} to ${dest}`);

        // Remove source file
        await fs.unlink(sourcePath);
        console.log(`Cleaned up ${src}`);
      } catch (error) {
        console.error(`Error processing ${src}:`, error);
      }
    }

    // 3. Try to remove empty improvements directory
    try {
      await fs.rmdir(path.join(docsDir, 'improvements'));
      console.log('Removed empty improvements directory');
    } catch (error) {
      console.log('Note: Could not remove improvements directory - might not be empty');
    }

    console.log('Final documentation cleanup complete');
  } catch (error) {
    console.error('Error during final cleanup:', error);
  }
}

// Run the cleanup
finalCleanup().catch(console.error);
