FILE OPERATIONS SYSTEM

1. CORE UTILITIES

FILE CONVERTER:
```typescript
class FileConverter {
  // Safe file operations
  static async safeWrite(targetPath: string, content: string): Promise<void>;
  static async convertFile(sourcePath: string, targetFormat: string): Promise<string>;
  static async verifyContent(filePath: string, expectedContent: string): Promise<boolean>;
}
```

DOC HANDLER:
```typescript
class DocHandler {
  // Markdown-specific operations
  static async updateDoc(docPath: string, content: string): Promise<boolean>;
}
```

2. KEY FEATURES

SAFE WRITE OPERATIONS:
- Uses .txt as intermediate format
- Automatic directory creation
- Content verification
- Backup creation
- Format conversion

PATH HANDLING:
- Absolute path resolution
- Directory existence checks
- Proper error handling
- Cross-platform compatibility

BACKUP SYSTEM:
- Automatic backup creation
- .backup extension
- Original content preservation
- Safe conversion process

3. USAGE EXAMPLES

MARKDOWN FILES:
```typescript
// Update markdown documentation
await DocHandler.updateDoc('docs/example.md', content);

// Verify content
const verified = await FileConverter.verifyContent('docs/example.md', content);
```

GENERAL FILES:
```typescript
// Write any file type
await FileConverter.safeWrite('path/to/file.ext', content);

// Convert between formats
const newPath = await FileConverter.convertFile('original.txt', 'md');
```

4. BEST PRACTICES

FILE OPERATIONS:
- Always use safeWrite for new content
- Verify content after writes
- Check operation success
- Handle errors appropriately

DOCUMENTATION:
- Use DocHandler for markdown files
- Keep backups before major changes
- Verify file contents after updates
- Use absolute paths when possible

5. ERROR HANDLING

COMMON ISSUES:
- Path resolution errors
- Write permission issues
- Directory access problems
- Content verification failures

RECOVERY STEPS:
1. Check file permissions
2. Verify directory existence
3. Use backup files if needed
4. Retry with absolute paths

6. IMPLEMENTATION DETAILS

DIRECTORY HANDLING:
```typescript
// Automatic directory creation
await fs.mkdir(path.dirname(absolutePath), { recursive: true });

// Path resolution
const absolutePath = path.isAbsolute(path) ? path : path.resolve(path);
```

CONTENT VERIFICATION:
```typescript
// Verify after write
const content = await fs.readFile(absolutePath, 'utf-8');
return content === expectedContent;
```

7. WORKFLOW INTEGRATION

DOCUMENTATION UPDATES:
1. Write content as .txt
2. Convert to target format
3. Verify content
4. Create backup
5. Clean up temp files

VERSION CONTROL:
1. Stage changes
2. Verify modifications
3. Commit updates
4. Push to remote

8. SECURITY CONSIDERATIONS

FILE OPERATIONS:
- Check file permissions
- Validate paths
- Sanitize content
- Maintain backups

DATA PROTECTION:
- Backup before changes
- Verify after writes
- Handle sensitive content
- Clean up temp files

9. MAINTENANCE

REGULAR TASKS:
- Clean up temp files
- Verify backups
- Check permissions
- Update documentation

MONITORING:
- Track operation success
- Log error patterns
- Monitor disk usage
- Verify file integrity

10. FUTURE IMPROVEMENTS

PLANNED FEATURES:
- Batch operations
- Format validation
- Content templates
- Enhanced backup system

OPTIMIZATION:
- Performance improvements
- Better error handling
- Extended format support
- Workflow automation
