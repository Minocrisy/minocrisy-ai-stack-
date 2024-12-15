import { promises as fs } from 'fs';
import * as path from 'path';

async function reorganizeDocs() {
  try {
    const projectRoot = path.resolve(__dirname, '../..');
    const docsDir = path.join(projectRoot, 'docs');

    // Additional file moves mapping: [source, destination]
    const moves = [
      // Core documentation
      ['handoff-instructions.md', 'guides/development/handoff.md'],
      ['main-docs.md', 'core/main.md'],
      ['vision/system-overview.md', 'core/system-overview.md'],
      ['improvements/yogi-consolidation-strategy.md', 'core/consolidation-strategy.md'],

      // Move any remaining environment docs
      ['environment/browser-testing.txt', 'guides/environment/browser-testing.txt']
    ];

    // Process each move
    for (const [src, dest] of moves) {
      try {
        const sourcePath = path.join(docsDir, src);
        const destPath = path.join(docsDir, dest);

        // Ensure destination directory exists
        await fs.mkdir(path.dirname(destPath), { recursive: true });

        // Read source content
        const content = await fs.readFile(sourcePath, 'utf-8');

        // Write to new location
        await fs.writeFile(destPath, content, 'utf-8');

        console.log(`Moved ${src} to ${dest}`);

        // Try to remove source file and its backup
        try {
          await fs.unlink(sourcePath);
          await fs.unlink(sourcePath + '.backup').catch(() => {});
          console.log(`Cleaned up ${src}`);
        } catch (error) {
          console.log(`Note: Could not remove ${src} - might be already moved`);
        }
      } catch (error) {
        console.error(`Error processing ${src} to ${dest}:`, error);
        // Continue with next file
        continue;
      }
    }

    // Clean up directories
    const cleanupDirs = ['vision', 'environment', 'test'];
    for (const dir of cleanupDirs) {
      try {
        await fs.rm(path.join(docsDir, dir), { recursive: true, force: true });
        console.log(`Removed directory: ${dir}`);
      } catch (error) {
        console.log(`Note: Could not remove ${dir} - might not exist or already removed`);
      }
    }

    // Remove all .backup files
    const removeBackups = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          await removeBackups(fullPath);
        } else if (entry.name.endsWith('.backup')) {
          await fs.unlink(fullPath);
          console.log(`Removed backup file: ${fullPath}`);
        }
      }
    };

    await removeBackups(docsDir);

    console.log('Documentation reorganization complete');
  } catch (error) {
    console.error('Error during reorganization:', error);
  }
}

// Run the reorganization
reorganizeDocs().catch(console.error);
