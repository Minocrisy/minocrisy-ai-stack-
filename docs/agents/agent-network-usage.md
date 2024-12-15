AGENT NETWORK USAGE GUIDE

1. OVERVIEW
The agent network coordinates tasks between Cline and Gemini agents, managing task distribution and status tracking.

2. AVAILABLE COMMANDS

CREATE TASK:
{
  "command": "create_task",
  "args": {
    "type": "code_development|documentation|testing|review|deployment",
    "description": "Task description",
    "assignTo": "cline|gemini|any",
    "dependencies": ["task_id1", "task_id2"] // optional
  }
}

GET NETWORK STATUS:
{
  "command": "get_network_status"
}

UPDATE TASK STATUS:
{
  "command": "update_task_status",
  "args": {
    "taskId": "task_123",
    "status": "pending|in_progress|completed|failed"
  }
}

3. AGENT CAPABILITIES

CLINE AGENT:
- system_operations
- file_management
- environment_setup
- testing
- browser_automation

GEMINI AGENT:
- code_completion
- code_review
- documentation_review
- in_editor_assistance

4. TASK TYPE MAPPING
- code_development -> gemini
- documentation -> cline
- testing -> cline
- review -> gemini
- deployment -> cline

5. EXAMPLE WORKFLOWS

CODE DEVELOPMENT:
1. Create task:
   {
     "command": "create_task",
     "args": {
       "type": "code_development",
       "description": "Implement new feature X",
       "assignTo": "gemini"
     }
   }

2. Gemini works on code in editor

3. Update status:
   {
     "command": "update_task_status",
     "args": {
       "taskId": "task_123",
       "status": "in_progress"
     }
   }

4. Cline tests implementation:
   {
     "command": "create_task",
     "args": {
       "type": "testing",
       "description": "Test feature X implementation",
       "assignTo": "cline",
       "dependencies": ["task_123"]
     }
   }

DOCUMENTATION:
1. Create task:
   {
     "command": "create_task",
     "args": {
       "type": "documentation",
       "description": "Update API documentation",
       "assignTo": "cline"
     }
   }

2. Gemini reviews:
   {
     "command": "create_task",
     "args": {
       "type": "review",
       "description": "Review API documentation updates",
       "assignTo": "gemini",
       "dependencies": ["task_124"]
     }
   }

6. BEST PRACTICES

TASK CREATION:
- Provide clear, detailed descriptions
- Set appropriate dependencies
- Use "any" assignTo for flexible assignment

TASK MANAGEMENT:
- Update status promptly
- Check dependencies before starting
- Verify task completion

ERROR HANDLING:
- Check task existence before updates
- Verify agent availability
- Handle dependency conflicts

7. MONITORING

Use get_network_status to:
- View all active tasks
- Check agent availability
- Monitor task progress
- Verify dependencies

8. COMMON USE CASES

FEATURE DEVELOPMENT:
1. Gemini: Code implementation
2. Cline: Testing
3. Gemini: Code review
4. Cline: Deployment

DOCUMENTATION:
1. Cline: Write documentation
2. Gemini: Review
3. Cline: Update based on review
4. Gemini: Final approval

TESTING:
1. Cline: Write tests
2. Gemini: Review test coverage
3. Cline: Run test suite
4. Gemini: Code fixes if needed
