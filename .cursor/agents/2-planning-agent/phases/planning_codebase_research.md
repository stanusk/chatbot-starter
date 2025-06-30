# Codebase Research & Pattern Analysis Instructions

These instructions guide the initial phase of planning where you analyze the PRD and research existing codebase patterns to understand implementation constraints and architectural decisions.

- Purpose: Pattern discovery and constraint identification ONLY
- Permitted: Reading PRD, researching referenced files, understanding existing patterns
- Forbidden: Creating tasks, making implementation decisions, suggesting solutions
- Requirement: You must ONLY identify patterns to follow and architectural constraints
- Output Format: Begin with [PHASE: CODEBASE RESEARCH], then follow instructions below
- Focus: Understanding HOW things are currently done to guide implementation agents correctly

## Research Process

**Research Objective**: Identify exact patterns, architectural constraints, and implementation references that implementation agents must follow.

**Required Reference**: Read `.cursor/rules/700-task-planning-agent-orchestration.mdc` to understand the complexity classification system and functional slice principles that guide this research.

You are to follow these steps in the current phase to achieve your objectives:

1. PRD Analysis & Context Understanding
2. Referenced Pattern Research
3. Architectural Constraint Discovery
4. Implementation Boundary Identification
5. Research Summary & Completion

Below are further instructions for those steps to be followed to the letter.

### PRD Analysis & Context Understanding

- Read the entire PRD document thoroughly to understand feature scope and requirements
- Identify all referenced existing components, services, and patterns mentioned in "Existing Codebase References"
- Note any specific constraints mentioned in "Non-functional Requirements" that affect implementation approach
- **CRITICAL: Pay special attention to any "MUST FOLLOW" patterns explicitly mentioned**
- Identify the feature complexity level (simple extension vs complex new functionality vs new architectural pattern)

### PRD Completeness Validation

<critical>
Implementation agents only have access to your output, NOT the PRD. Every requirement must be explicitly transferred to task documentation through your analysis.
</critical>

Before proceeding, verify ALL PRD requirements are captured for transfer:

**Functional Requirements Audit**:

- Review each User Story - is the implementation path clear and complete?
- Review each Functional Requirement - will implementation agents know exactly how to build this?
- Check for conditional logic, optional fields, state-dependent behavior
- Be extra careful about the content of "Important Observations" section in the PRD

**Business Rules Extraction**:

- Analyse all enabling/disabling conditions for actions
- Note all validation rules and their error handling
- Identify all user feedback scenarios (success, error, warning messages)
- Capture all state transitions and their triggers

**Data Requirements Verification**:

- List all data that must be displayed, input, or processed
- Note optional vs required data handling requirements
- Document all user input requirements and validation rules
- Identify all error scenarios and their specific handling

**Missing Requirements Risk Assessment**:

- Any requirement not explicitly transferred to task documentation = missing implementation

### Referenced Pattern Research

- Research EVERY file and service mentioned in the PRD's "Existing Codebase References" section
- **For services marked as "MUST FOLLOW THIS EXACT PATTERN"**: Understand the complete implementation approach, not just method signatures
- For referenced components: Understand their structure, data flow, and interaction patterns
- **CRITICAL: Understand async operations, state management, and complex interaction patterns exactly as implemented**
- Note component composition strategies (when to extend vs create new vs create subcomponents)

<critical>
Do NOT research beyond the files explicitly mentioned in the PRD unless:
- You find a pattern reference that leads to another critical implementation file
- The referenced file imports/uses another service that's central to the pattern
- You discover the referenced pattern is incomplete without understanding its dependencies
</critical>

### Architectural Constraint Discovery

- Analyze which cursor rules apply to this implementation (find rules in `.cursor/rules/` and reference them by name, don't reproduce their content)
- Identify the data flow pattern required
- Determine error handling requirements based on user-feedback-rules
- Identify UI/component patterns based on 300-ui-design-rules

### Implementation Boundary Identification

Classify the work according to the functional slice principles defined in `.cursor/rules/700-task-planning-agent-orchestration.mdc`.

Reference that file to understand:

- How to break down features into functional slices that deliver testable functionality
- What constitutes a minimal working end-to-end flow
- How to structure phases so users can validate progress at each checkpoint

### Research Summary & Completion

Create a structured summary including:

**Pattern References Found**:

- List exact files and their implementation patterns to follow
- Note any critical architectural decisions these patterns demonstrate

**Architectural Constraints**:

- List applicable cursor rules by name
- Note data flow requirements and service layer decisions

**Complexity Assessment**:

- Simple Extension: Adding to existing well-established patterns
- Complex Feature: New functionality with multiple services/components
- Architectural Feature: Introducing new patterns or significant changes

**Functional Slice Classification**:

- Breakdown of how feature can be delivered in testable working slices
- Identification of minimal working end-to-end flow for first phase

**Implementation Sequence Required**:

- Based on functional value delivery and user validation points
- Each phase building upon previous working functionality

## Research Completion Signal

When research is complete, end with:

**[RESEARCH COMPLETE - READY FOR TASK PLANNING]**
