YOGI Development System - Master Project Structure

ROOT STRUCTURE
```
yogi-dev-system/
├── .idx/                      # Development Environment
│   ├── dev.nix.template      # Base environment template
│   └── dev.nix              # Local environment (gitignored)
│
├── src/                      # Source Code
│   ├── components/          # UI Components
│   ├── services/           # API Services
│   ├── utils/             # Utilities
│   └── types/            # TypeScript Types
│
├── docs/                    # Documentation
│   ├── vision/            # System Vision & Architecture
│   ├── guides/           # User & Development Guides
│   └── api/             # API Documentation
│
└── templates/              # Project Templates
    ├── basic/           # Basic Project Setup
    ├── ai-app/         # AI Application Template
    └── api-service/   # API Service Template
```

DETAILED BREAKDOWN

1. Development Environment (.idx/)
   ```
   .idx/
   ├── dev.nix.template           # Shared environment definition
   ├── dev.nix                    # Local environment (gitignored)
   └── scripts/                   # Environment setup scripts
       ├── setup.sh
       └── verify.sh
   ```

2. Source Code (src/)
   ```
   src/
   ├── components/                # UI Components
   │   ├── ui/                   # Base UI Components
   │   │   ├── Button.tsx
   │   │   ├── Card.tsx
   │   │   ├── Input.tsx
   │   │   └── index.ts
   │   └── templates/           # Component Templates
   │       ├── AIChat/
   │       └── ImageGen/
   │
   ├── services/                # API Services
   │   ├── api/                # API Definitions
   │   │   ├── types.ts       # Common Types
   │   │   └── templates/    # Service Templates
   │   └── implementations/  # Example Implementations
   │
   ├── utils/                 # Utility Functions
   │   ├── doc-handler.ts    # Documentation Tools
   │   ├── file-converter.ts # File Operations
   │   └── test-utils.ts    # Testing Utilities
   │
   └── types/               # TypeScript Types
       ├── api.d.ts       # API Type Definitions
       └── components.d.ts # Component Types
   ```

3. Documentation (docs/)
   ```
   docs/
   ├── vision/                   # System Vision
   │   ├── quick-start.md      # Getting Started
   │   ├── use-cases.md       # Use Cases
   │   ├── architecture.md    # Technical Architecture
   │   └── development-guide.md # Development Guide
   │
   ├── guides/                 # User Guides
   │   ├── installation.md    # Installation Guide
   │   ├── configuration.md  # Configuration Guide
   │   └── deployment.md    # Deployment Guide
   │
   └── api/                  # API Documentation
       ├── services.md     # Service Interfaces
       └── components.md  # Component API
   ```

4. Project Templates (templates/)
   ```
   templates/
   ├── basic/                    # Basic Project
   │   ├── .idx/               # Environment Setup
   │   ├── src/               # Source Code
   │   └── README.md         # Template Documentation
   │
   ├── ai-app/                 # AI Application
   │   ├── .idx/             # Environment Setup
   │   ├── src/             # Source Code
   │   │   ├── components/ # UI Components
   │   │   └── services/  # AI Services
   │   └── README.md      # Template Documentation
   │
   └── api-service/          # API Service
       ├── .idx/           # Environment Setup
       ├── src/           # Source Code
       │   └── api/      # API Implementation
       └── README.md    # Template Documentation
   ```

KEY ASPECTS

1. Environment Management
   - Base templates in .idx/
   - Local configurations ignored
   - Setup scripts included

2. Component Organization
   - Base UI components
   - Template components
   - Clear hierarchy

3. Service Structure
   - Type definitions
   - Interface templates
   - Example implementations

4. Documentation Layout
   - Vision documents
   - User guides
   - API documentation

5. Template System
   - Basic setups
   - Specialized templates
   - Complete examples

USAGE PATTERNS

1. New Project Setup
   ```bash
   # Copy template
   cp -r templates/basic my-project

   # Setup environment
   cp .idx/dev.nix.template my-project/.idx/dev.nix

   # Initialize
   cd my-project && npm install
   ```

2. Component Usage
   ```bash
   # Copy base components
   cp -r src/components/ui my-project/src/components/

   # Copy template component
   cp -r src/components/templates/AIChat my-project/src/components/
   ```

3. Service Integration
   ```bash
   # Copy service types
   cp src/services/api/types.ts my-project/src/services/

   # Copy template implementation
   cp -r src/services/implementations/example my-project/src/services/
   ```

This structure provides:
- Clear organization
- Easy navigation
- Consistent patterns
- Flexible templates

Each part is:
- Well-documented
- Self-contained
- Easy to understand
- Ready to use
