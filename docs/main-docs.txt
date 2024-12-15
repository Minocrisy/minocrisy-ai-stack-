# AI Development Stack Documentation

## Core Components

### Development Environment
- Nix-powered environment management
- IDX integration
- Comprehensive tool suite
- Security-first approach

### File Operations System
- Safe file operations with FileConverter utility
- Markdown handling with DocHandler
- Automatic backup creation
- Content verification
- Format conversion support

### Agent Communication
- Cline API integration
- Template-based configuration
- Secure credential handling
- Task coordination

## Tool Suite
- Python with AI/ML libraries
- Node.js and TypeScript
- Cloud tools (AWS, GCP, Azure)
- Database tools (MongoDB, PostgreSQL, Redis)
- Media processing (FFmpeg, OpenCV, ImageMagick)
- Security tools (GPG, SSH, SOPS)
- File operation utilities

## Environment Variables
- CLINE_API_KEY: Agent communication
- NOTION_API_KEY: Notion integration
- TWITTER_API_KEY: Twitter integration
- GLHF_API_KEY: AI integration
- Database and cloud configurations

## Development Workflow

### Setup
1. Clone repository
2. Copy dev.nix.template to dev.nix
3. Add actual credentials
4. Open in VSCode with IDX
5. Rebuild environment when prompted

### File Operations
1. Use FileConverter for safe file operations
2. Use DocHandler for markdown files
3. Verify content after changes
4. Maintain backups
5. Use proper error handling

### Documentation
1. Write content as .txt first
2. Convert to final format
3. Verify content
4. Create backups
5. Update version control

## Known Issues and Solutions

### VSCode Extension UI
- Diff editor errors are handled by FileConverter
- Safe write operations ensure reliability
- Content verification confirms changes
- Backup system prevents data loss

### File Operations
- Use provided utilities for all file operations
- Follow the documented workflow
- Verify all changes
- Keep backups
- Use absolute paths

## Security Guidelines
- Never commit real API keys
- Keep sensitive data in local files
- Use templates for sharing
- Follow .gitignore rules
- Regular security audits

## Best Practices
- Test all changes in development
- Document changes immediately
- Use provided file operation utilities
- Manual verification when needed
- Keep backups of important content
- Regular testing of environment

## Utilities Documentation

### FileConverter
- Safe file operations
- Format conversion
- Content verification
- Backup creation
- Error handling

### DocHandler
- Markdown file management
- Safe documentation updates
- Content verification
- Backup management
- Error handling

## Testing
- Automated tests for utilities
- Manual verification steps
- Error handling verification
- Backup system testing
- Format conversion testing
