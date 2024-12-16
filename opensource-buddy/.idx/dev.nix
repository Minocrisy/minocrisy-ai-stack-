# Development environment configuration for OpenSource Buddy
# Purpose: AI-powered platform for non-technical open source contributions

{ pkgs, ... }: {
  channel = "stable-23.11";

  packages = [
    # Core Development
    pkgs.nodejs_20
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.git
    pkgs.ripgrep
    pkgs.jq

    # Build & Deploy
    pkgs.docker
    pkgs.docker-compose
    pkgs.nginx

    # Testing & Accessibility
    pkgs.pa11y          # Accessibility testing
    pkgs.lighthouse     # Performance and accessibility auditing
    pkgs.chromium      # For headless testing
    pkgs.firefox       # For cross-browser testing

    # Development Tools
    pkgs.curl
    pkgs.watchman      # File watching
    pkgs.eslint        # Linting
    pkgs.prettier      # Code formatting

    # Language Support
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.prettier
    pkgs.nodePackages.eslint
  ];

  env = {
    # Editor & Terminal
    EDITOR = "code";
    TERM = "xterm-256color";

    # Development Configuration
    NODE_ENV = "development";
    NEXT_TELEMETRY_DISABLED = "1";

    # Testing Configuration
    CHROME_BIN = "${pkgs.chromium}/bin/chromium";
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "true";

    # API Keys (to be replaced locally)
    OPENAI_API_KEY = "";
    GITHUB_TOKEN = "";
  };

  # IDX specific configurations
  idx = {
    extensions = [
      # Core IDE Features
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "editorconfig.editorconfig"
      
      # Accessibility
      "deque-systems.vscode-axe-linter"
      "webhint.vscode-webhint"
      
      # Development
      "ms-vscode.vscode-typescript-next"
      "bradlc.vscode-tailwindcss"
      "csstools.postcss"
      
      # Testing
      "ms-playwright.playwright"
      
      # Git
      "eamodio.gitlens"
      "mhutchie.git-graph"
      
      # AI Assistance
      "github.copilot"
      "github.copilot-chat"
      
      # IDE Enhancements
      "usernamehw.errorlens"
      "wayou.vscode-todo-highlight"
      "christian-kohler.path-intellisense"
    ];

    workspace = {
      onCreate = {
        setup = ''
          echo "🔧 Setting up OpenSource Buddy development environment..."
          npm install
          npm run build
        '';
      };

      onStart = {
        environment-check = ''
          echo "🔍 Checking development environment..."
          echo "Node Version: $(node --version)"
          echo "NPM Version: $(npm --version)"
          echo "TypeScript Version: $(npx tsc --version)"
          echo "Git Version: $(git --version)"
        '';
      };
    };
  };
}
