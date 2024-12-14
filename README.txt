AI Development Stack

A complete AI, Web, and Cloud development environment powered by Nix, featuring agent network integration.

File Structure
-------------

.idx/
  - dev.nix.template         # Base template with placeholders
  - dev.local.nix           # Your local configuration (gitignored)

my-idx-template/.idx/
  - dev.nix.template        # Instance template with placeholders
  - dev.local.nix          # Your local instance configuration (gitignored)

Setup
-----

1. Create your local configuration:

   # For base environment
   cp .idx/dev.nix.template .idx/dev.local.nix
   
   # For instance environment (if needed)
   cp my-idx-template/.idx/dev.nix.template my-idx-template/.idx/dev.local.nix

2. Update your local configuration(s):
   - Edit .idx/dev.local.nix and/or my-idx-template/.idx/dev.local.nix
   - Replace placeholder values with your actual credentials
   - Configure agent network settings if needed
   - Local .local.nix files are gitignored to protect your sensitive data

Features
--------

Core Development:
- Python development with LSP support and AI/ML libraries
- Node.js and TypeScript with modern tooling
- Docker and Kubernetes for containerization
- Cloud tools (AWS, GCP, Azure) with CLI support
- Database tools (MongoDB, PostgreSQL, Redis) with management interfaces
- Media processing (FFmpeg, OpenCV, ImageMagick)
- Security tools (GPG, SSH, SOPS) for authentication and encryption
- Git and GitHub integration with advanced features

Agent Network Support:
- Browser automation with Puppeteer and Chromium
- Agent network configuration and management
- AI integration with Gemini
- Enhanced workspace checks for agent dependencies

IDE Integration:
- VSCode extensions for enhanced development
- AI-specific extensions for agent integration
- Jupyter notebook support
- Automated environment setup and configuration

Usage
-----

1. Clone the repository:
   git clone https://github.com/Minocrisy/minocrisy-ai-stack-
   cd minocrisy-ai-stack-

2. Set up your local configuration:
   - Follow the setup steps above to create your local config files
   - Configure your credentials and environment settings
   - Verify agent network dependencies if using those features

3. Open in VSCode with IDX:
   - The environment will automatically check dependencies
   - Agent network status will be verified on startup
   - Click "Rebuild environment" when prompted

4. Verify your setup:
   - Check the environment status in the terminal
   - Verify agent network connectivity if enabled
   - Test browser automation capabilities if needed

Environment Variables
-------------------

Your local configuration (dev.local.nix) should include:

Core Settings:
- CLINE_API_KEY: Your Cline API key
- NOTION_API_KEY: Your Notion API key
- NOTION_DATABASE_ID: Your Notion database ID

Agent Network Settings:
- AGENT_NETWORK_PORT: Default is 3000
- AGENT_NETWORK_HOST: Default is localhost
- PUPPETEER_EXECUTABLE_PATH: Path to Chromium for browser automation

AI Integration:
- GEMINI_API_KEY: Your Gemini API key for AI integration
- GLHF_API_KEY: Your GLHF API key

Note: Never commit your local configuration files. Always use the templates for version control and keep your credentials secure.
