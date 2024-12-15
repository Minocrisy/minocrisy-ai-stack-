import { DocHandler } from './doc-handler';
import { FileConverter } from './file-converter';
import * as path from 'path';

// Get the project root directory
const projectRoot = path.resolve(__dirname, '../..');

async function testFileOperations() {
  console.log('Testing file operations...\n');

  // Create test directory if it doesn't exist
  const testDir = path.join(projectRoot, 'docs/test');
  await require('fs/promises').mkdir(testDir, { recursive: true });

  // Test 1: Write a simple txt file
  console.log('Test 1: Writing txt file');
  const txtContent = 'This is a test txt file.\nIt should write successfully.';
  try {
    const txtPath = path.join(testDir, 'simple.txt');
    await FileConverter.safeWrite(txtPath, txtContent);
    const verified = await FileConverter.verifyContent(txtPath, txtContent);
    console.log('TXT write success:', verified);
  } catch (error) {
    console.error('TXT write failed:', error);
  }

  // Test 2: Write a markdown file using DocHandler
  console.log('\nTest 2: Writing markdown file');
  const mdContent = `# Test Markdown File

## Section 1
This is a test markdown file.
It should be written using our safe write procedure.

## Section 2
Testing features:
- Safe write operation
- Content verification
- Backup creation`;

  try {
    const mdPath = path.join(testDir, 'test.md');
    const success = await DocHandler.updateDoc(mdPath, mdContent);
    console.log('MD write success:', success);
  } catch (error) {
    console.error('MD write failed:', error);
  }

  // Test 3: Convert between formats
  console.log('\nTest 3: Format conversion');
  try {
    const sourcePath = path.join(testDir, 'simple.txt');
    const convertedPath = await FileConverter.convertFile(sourcePath, 'md');
    console.log('Conversion success:', convertedPath);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

// Run tests
console.log('Starting file operation tests...\n');
testFileOperations().catch(console.error);
