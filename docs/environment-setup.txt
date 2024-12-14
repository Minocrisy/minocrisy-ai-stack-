ENVIRONMENT SETUP AND CONFIGURATION

1. DIRECTORY STRUCTURE
- .idx/dev.nix.template: Base configuration template
- .idx/dev.nix: Local file with real credentials (gitignored)
- my-idx-template/.idx/dev.nix: Local template instance

2. INSTALLED PACKAGES

CORE DEVELOPMENT:
- nodejs_20
- python311 + pip
- go
- git
- ripgrep
- jq

BUILD & DEPLOY:
- docker + docker-compose
- kubectl
- terraform
- nginx

DATABASE TOOLS:
- mongodb-tools + mongosh
- postgresql client
- redis client

CLOUD & INFRASTRUCTURE:
- google-cloud-sdk
- awscli2
- azure-cli

MEDIA PROCESSING:
- ffmpeg
- opencv
- imagemagick
- vips

SECURITY:
- gh (GitHub CLI)
- gnupg
- openssh
- sops

3. VSCODE EXTENSIONS

IDE CORE:
- Vim emulation
- EditorConfig
- Code spell checker

DEVELOPMENT:
- Python
- Go
- Rust
- ESLint
- Prettier

CLOUD & DATABASE:
- Docker
- Terraform
- Cloud Code
- MongoDB
- PostgreSQL

COLLABORATION:
- GitHub Copilot
- GitLens
- Git Graph

4. ENVIRONMENT CHECKS

ON CREATE:
- Git version
- Docker version
- Python version
- Node.js version

ON START:
- System tools version check
- Git status
- Docker status
- Cloud CLI versions

5. CONFIGURATION STEPS

INITIAL SETUP:
1. Clone repository
2. Copy dev.nix.template
3. Add credentials
4. Open in VSCode
5. Rebuild environment

CREDENTIAL SETUP:
1. Get API keys from respective services
2. Add to local dev.nix
3. Never commit actual keys
4. Use templates for sharing

VERIFICATION:
1. Check tool versions
2. Test basic commands
3. Verify environment variables
4. Test API connections

6. TROUBLESHOOTING

COMMON ISSUES:
- Diff editor errors (expected)
- File operation delays
- Read operation sluggishness

SOLUTIONS:
- Use .txt for reliable writes
- Verify changes manually
- Create new files vs modifying
- Regular environment rebuilds
