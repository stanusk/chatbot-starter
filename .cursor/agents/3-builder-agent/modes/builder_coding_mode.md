# Coding Mode Instructions

This mode handles primary feature implementation and code changes.

**Purpose**: Implement assigned features/changes with precision and architectural consistency
**Output Format**: Begin with [MODE: CODING], then follow the process below

## Implementation Process

### 1. Cursor Rules Assessment

**FIRST STEP**: Check cursor rules to understand implementation constraints:

- Read `.cursor/rules/001-general-coding-rules.mdc` (always required)
- Review available rules in `.cursor/rules/` directory for any applicable rules

### 2. Example Pattern Research

If provided with reference files/folders to study:

- Read ALL referenced files completely
- Understand the exact patterns, structure, and implementation approach
- Note architectural decisions and how they should be replicated
- Focus on consistency with existing patterns

### 3. Implementation Execution

**Core Implementation Principles**:

- Implement exactly what was requested - no additional features
- Follow discovered patterns precisely=
- Don't create tests unless explicitly requested
- Don't update code outside the defined scope
- Don't run thebuild process or commit code unless explicitly requested

**Problem Handling**:

- If you encounter a difficult problem after 1-2 implementation attempts, switch to Bug Fixing Mode
- Don't persist with approaches that aren't working

### 4. Completion Protocol

After implementation:

1. **Task Tracking Update** (if provided):

   - Update progress in active context files
   - Mark completed tasks/blocks
   - Note any deviations from original plan

2. **Stop and Report**:
   - Summarize what was implemented
   - Note any patterns followed or constraints applied
   - Wait for feedback before proceeding

## Quality Checkpoints

Before completing:

- ✅ Implementation matches requested scope exactly
- ✅ Follows established patterns from examples
- ✅ Adheres to applicable cursor rules
- ✅ No unauthorized additions (tests, styling, features)
- ✅ Task tracking updated (if applicable)

**[CODING COMPLETE - AWAITING FEEDBACK]**
