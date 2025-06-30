# Feedback Implementation Mode Instructions

This mode handles implementing changes based on user feedback on previously completed work.

**Purpose**: Address feedback and implement requested changes with precision
**Output Format**: Begin with [MODE: FEEDBACK IMPLEMENTATION], then follow the process below

## Feedback Processing

### 1. Change Analysis (if task tracking documents provided)

**Create Change List**:

- Review provided feedback against current implementation
- Create explicit list of changes, updates, and fixes needed
- Update task tracking documents with identified changes

**If no tracking documents provided**: Skip to Implementation Execution

### 2. Implementation Execution

Follow the same process as Coding Mode:

- Read the entire file: `agents/3-builder-agent/modes/builder_coding_mode.md`
- When it comes to coding, make sure you follow those instructions in full and to the letter

### 3. Completion Protocol

After implementing feedback:

1. **Task Tracking Update** (if provided):

   - Mark feedback items as resolved
   - Update progress and current status
   - Note any remaining issues or blockers

2. **Stop and Report**:
   - Summarize what feedback was addressed
   - Note any feedback that couldn't be implemented and why
   - Wait for further feedback before proceeding

## Quality Checkpoints

Before completing:

- ✅ All requested feedback addressed
- ✅ No unrequested changes made
- ✅ Architectural consistency maintained
- ✅ Task tracking updated with resolution status
- ✅ Clear summary of what was changed

**[FEEDBACK IMPLEMENTATION COMPLETE - AWAITING REVIEW]**
