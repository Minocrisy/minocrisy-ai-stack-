# Repository Structure and Workflow

## Repository Structure
This repository is part of a larger development workflow:

1. Main Repository: `minocrisy-ai-stack-`
   - Contains the stable, production-ready configuration
   - Protected branch: `main`
   - Template files for environment setup

2. Development Environment:
   - Each time you open the project in IDX, you are working in a development environment
   - Local `dev.nix` files contain actual API keys and configurations
   - These files are gitignored to protect sensitive data

## When to Update Main
Update the main repository when:
- You have tested changes thoroughly in development
- New features or configurations are stable
- Core dependencies or tools need updating
- Templates need to be updated

## How to Update Main
1. Ensure your changes work in the development environment first
2. Only update template files (never commit actual credentials)
3. Update documentation if needed
4. Commit and push to main branch

## For AI Assistants
Important notes for AI assistants working with this repository:

1. File Structure:
   - `.idx/dev.nix.template`: Base template for environment
   - `.idx/dev.nix`: Local file with real credentials (gitignored)
   - `my-idx-template/.idx/dev.nix`: Local template instance (gitignored)

2. Always:
   - Work with template files for commits
   - Keep credentials in local dev.nix files only
   - Test changes in development environment
   - Update documentation when needed

3. Never:
   - Commit files containing real API keys
   - Modify gitignored files in commits
   - Push sensitive data to the repository

## Security Guidelines
- API keys stay in local dev.nix files only
- Template files use placeholder values
- Follow .gitignore rules strictly
- Keep sensitive data protected
