# Task Documentation & Context Setup Instructions

These instructions guide the documentation phase where you create the final task documentation and active context files that implementation agents will use to execute the feature.

- Purpose: Documentation creation and context setup ONLY
- Permitted: Creating tasks.md and active-context.md files, structuring implementation guidance
- Forbidden: Making implementation decisions, changing task scope, adding new requirements
- Requirement: You must create clear, actionable documentation based on the planning completed in previous phases
- Output Format: Begin with [PHASE: TASK DOCUMENTATION], then follow instructions below
- Focus: Creating implementation guidance that balances autonomy with constraint adherence

## Documentation Creation Process

**Documentation Objective**: Create complete task documentation and persistent context tracking that guides implementation agents effectively while maintaining architectural consistency.

**Required Reference**: Use the functional slice validation requirements defined in `.cursor/rules/700-task-planning-agent-orchestration.mdc` to ensure consistency with the orchestration system.

You are to follow these steps in the current phase to achieve your objectives:

1. Tasks File Creation
2. Active Context File Setup
3. Implementation Sequencing & Dependencies
4. Quality Assurance & Completion

Below are further instructions for those steps to be followed to the letter.

### Tasks File Creation

Create a new file named `[task-code]-tasks.md` in the `documentation/development/features/[task-code]-[feature-name]/` directory.

The file must follow this exact structure:

```markdown
# [Feature Name] - Implementation Tasks

## Task Summary for Review

Unlike the rest of the document, which is for the implementation agents, the task summary is for USER review to quickly understand what will be implemented. Include:

- **High-level feature outcomes** (what the user will be able to do)
- **Key functional areas being added/changed** (specific capabilities being implemented)
- **Important business rules or constraints**
- **Any significant architectural decisions resulting from the research or task strategy steps**

EXCLUDE:

- Orchestration details (checkpoint strategies, block counts)
- Implementation methodology descriptions

## Implementation Overview

**Complexity Classification**: [Simple Extension/Complex Feature/Architectural Feature]
**Functional Slice Strategy**: [Basic Working Flow → Complete / Core Flow → Error Handling → Advanced Features / etc.]
**Total Implementation Phases**: [X phases]

---

## Implementation Phases

[Implementation phases as designed in previous phase]

---

**Feature-Specific Constraints**:

- [Select applicable cursor rules from the comprehensive list below - include ALL that apply to this feature]
- [List specific patterns that must be followed for this feature]
- [List any feature-specific validation requirements]

**Available Cursor Rules for Selection**:

- List the content of the rules directory and it's subdirectories in `.cursor/rules/` and decide which rules need to be specifically mentioned for the builder agent to follow.
```

### Active Context File Setup

Create a new file named `[task-code]-active-context.md` in the same directory.

The file must follow this exact structure (only show sections when they contain actual content):

```markdown
# [Task Code] - [Feature Name] Active Context

## Current Status: [Not Started/In Progress/Blocked/Complete]

**Current Phase**: [Phase Name]  
**Overall Progress**: X% complete

## Completed Work

[Only list when work is actually completed - remove this section if empty]

## Remaining Work

[List upcoming phases in order]

## Current Blockers

[Only show this section if blockers exist - remove if none]

## Deviations from Plan

[Only show this section if deviations occurred - remove if none]
```

### Implementation Agent Guidance Integration

Within the tasks file, ensure each implementation phase includes feature-specific guidance that focuses on delivering working functionality. Generic agent behaviors are covered in implementation agent instructions.

**Cursor Rules Selection Guidelines**:

When creating the Feature-Specific Constraints section, you MUST:

- **Analyze the feature requirements** and select applicable rules from the provided list
- **Think critically about each rule** - don't just copy the list, select what's actually needed
- **Check for new rules** in the .cursor/rules/ folder that may have been added

### Implementation Sequencing & Dependencies

When phases have dependencies, focus on delivering complete working slices:

**Complete Functional Slices** (Recommended):

- Each phase delivers fully working end-to-end functionality
- Include all necessary elements (localization, basic styling, error handling) for the slice to work
- Example: "Phase 1: Complete basic message sending with Czech UI and error handling"

**Incremental Enhancement Approach** (When full integration not feasible):

- Earlier phases deliver minimal but complete working functionality
- Later phases enhance and expand the working functionality
- Ensure each phase can be independently tested and validated
- Example: "Phase 1: Basic working flow with minimal UI - Phase 2: Enhanced UI and advanced features"

**Dependency Documentation**:

- Clearly state what working functionality each phase builds upon
- Note what user-testable capabilities each phase adds
- Specify validation criteria that verify complete working functionality

**Research Guidance**:

- Specific files to research with focus areas
- Patterns to understand and follow exactly
- Cursor rules that apply to the implementation

**Implementation Scope**:

- Clear boundaries of what should be implemented
- Expected deliverable at block completion
- Self-validation criteria

**Constraint References**:

- Specific cursor rules to follow (by name, not content reproduction)
- Architectural patterns to maintain

### Quality Assurance & Completion

Before completing this phase, verify:

**Tasks File Quality**:

- All implementation phases have clear working functionality deliverables
- Research guidance is specific and actionable
- Validation criteria focus on user-testable outcomes
- Cursor rules are referenced appropriately

**Implementation Agent Readiness**:

- Agents have complete context for delivering working functionality that could be gathered from the PRD document
- All research directions relevant to functional slices were passed along to the implementation agent
- Validation criteria are executable and focus on working user functionality
- Each phase delivers complete testable functionality
- **Critical**: All phases are complete and cover all requirements from the PRD document

## Documentation Completion Signal

When documentation is complete, end with:

**[TASK DOCUMENTATION COMPLETE - READY FOR IMPLEMENTATION]**

Include a final summary:

- **Tasks File**: [path/filename]
- **Active Context File**: [path/filename]
- **Implementation Strategy**: [Brief summary]
- **First Implementation Agent**: Should start with [Phase Name]

**Phase 3 Output**: Complete `[task-code]-tasks.md` and `[task-code]-active-context.md` files ready for implementation agents
