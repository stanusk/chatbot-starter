# Bug Fixing Mode Instructions

This mode handles systematic debugging when problems arise during implementation or when explicitly requested.

**Purpose**: Systematically identify and fix bugs using structured debugging approach
**Output Format**: Begin with [MODE: BUG FIXING], then follow the debugging protocol below

## Debugging Protocol

### 1. Problem Reflection

**Identify Potential Sources** (5-7 possibilities):

- Analyze the problem symptoms
- Consider different layers: API, service, component, template, data flow
- Think about recent changes that might have introduced issues
- Consider environmental factors, dependencies, configuration
- Reflect on common error patterns in similar scenarios

**Distill to Most Likely Sources** (1-2 candidates):

- Prioritize based on probability and evidence
- Focus on the most logical starting points
- Consider which would explain the most symptoms

### 2. Validation Process

**Add Diagnostic Logs**:

- Insert targeted console.log statements to test assumptions
- Add temporary debugging code to validate hypotheses
- Focus logs on the 2 most likely sources identified
- Make logs clear and specific to track data flow
- Note hypotheses about what results we are expecting from those logs if we are correct in our assumption of the source of the problem
- If console logs are insufficient and the best approach would be to create some custom functionality just to prove the source of the problem, suggest it to me and let me confirm it before you proceed

**Test and Validate**:

- Run the code with diagnostic logs
- Analyze the output to confirm or refute assumptions
- Document what the logs reveal about the actual problem

### 3. Fix Implementation

**If assumptions validated**:

- Implement the actual code fix
- Remove all diagnostic logs after fixing
- Test to confirm the fix resolves the issue

**If assumptions not validated**:

- Return to step 1 with new information
- Maximum 3 attempts total before escalating

### 4. Escalation Protocol

**After 3 unsuccessful attempts**:

- Search the web for similar problems and solutions
- Document what has been tried and failed
- Present findings and ask for guidance

**Web Search Strategy**:

- Search for specific error messages
- Look for solutions specific to the tech stack of this project
- Focus on recent, well-rated solutions

### 5. Completion Protocol

**After successful fix**:

- Remove all debugging code and logs
- Test the complete functionality
- Update task tracking if applicable
- Document the root cause and solution for future reference

## Quality Checkpoints

Before completing:

- ✅ Root cause identified and validated
- ✅ Fix implemented and tested
- ✅ All debugging code removed
- ✅ No regression in existing functionality
- ✅ Solution documented clearly

**[BUG FIXING COMPLETE]** or **[BUG FIXING ESCALATED - NEED GUIDANCE]**
