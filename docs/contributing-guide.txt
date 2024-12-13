CONTRIBUTING AND WORKFLOW GUIDELINES

1. REPOSITORY STRUCTURE

MAIN REPOSITORY (minocrisy-ai-stack-):
- Stable, production-ready configuration
- Protected main branch
- Template files for setup
- Documentation in .txt and .md formats

DEVELOPMENT ENVIRONMENT:
- IDX-powered workspace
- Local credential files
- Gitignored sensitive data
- Working directory isolation

2. DEVELOPMENT WORKFLOW

BEFORE CHANGES:
1. Verify local dev.nix setup
2. Check all API keys
3. Test environment functionality
4. Review current documentation

MAKING CHANGES:
1. Test in development first
2. Update template files only
3. Document changes in .txt
4. Verify file operations
5. Push to main branch

3. FILE OPERATION GUIDELINES

WRITING FILES:
- Use .txt for initial documentation
- Expect diff editor errors
- Verify file contents after writing
- Create new vs modify existing

READING FILES:
- Expect some sluggishness
- Use list_files to verify existence
- Manual content verification
- Keep local backups

4. SECURITY PRACTICES

CREDENTIAL HANDLING:
- Keep API keys in local dev.nix
- Use templates for sharing
- Never commit real credentials
- Regular security checks

FILE MANAGEMENT:
- Follow .gitignore strictly
- Verify no sensitive data in commits
- Regular repository audits
- Backup important configurations

5. DOCUMENTATION STANDARDS

CONTENT GUIDELINES:
- Clear and comprehensive
- Include examples
- Document known issues
- Update troubleshooting guides

FILE HANDLING:
- Create as .txt first
- Verify content thoroughly
- Convert to .md when ready
- Manual GitHub updates

6. TESTING REQUIREMENTS

ENVIRONMENT TESTING:
- Verify tool versions
- Check API connections
- Test database access
- Validate cloud tools

CODE TESTING:
- Local development tests
- Environment isolation
- Security compliance
- Performance checks

7. COMMUNICATION GUIDELINES

AGENT INTERACTION:
- Clear task definitions
- Step-by-step verification
- Document all findings
- Regular progress updates

ISSUE REPORTING:
- Detailed descriptions
- Steps to reproduce
- Environment details
- Proposed solutions

8. MAINTENANCE

REGULAR TASKS:
- Update documentation
- Verify credentials
- Check template accuracy
- Test environment builds

PERIODIC REVIEWS:
- Security audits
- Performance checks
- Documentation updates
- Template maintenance
