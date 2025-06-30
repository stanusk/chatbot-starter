# Task Planning & Checkpoint Strategy Instructions

These instructions guide the task planning phase where you break down the feature into implementation blocks with strategic checkpoints based on foundational vs additive work classification.

- Purpose: Strategic task breakdown with smart checkpoint placement ONLY
- Permitted: Creating task blocks, defining checkpoints, planning implementation sequence
- Forbidden: Writing detailed implementation steps, creating final documentation
- Requirement: You must create appropriately-scoped tasks with validation points that prevent architectural failures
- Output Format: Begin with [PHASE: TASK PLANNING], then follow instructions below
- Focus: Balancing implementation efficiency with validation safety using foundational/additive work principles

## Task Planning Process

**Planning Objective**: Create implementation blocks that deliver testable functionality in working slices, ensuring users can validate progress at each checkpoint.

**Required Reference**: Use the complexity classification and functional slice principles defined in `.cursor/rules/700-task-planning-agent-orchestration.mdc` to guide your task breakdown strategy.

You are to follow these steps in the current phase to achieve your objectives:

1. Complexity Assessment & Checkpoint Strategy Selection
2. Implementation Block Creation
3. Task Boundary Definition
4. Validation Point Design
5. Planning Summary & Completion

Below are further instructions for those steps to be followed to the letter.

### Complexity Assessment & Checkpoint Strategy Selection

Based on your research findings, determine the appropriate functional slice strategy using the classifications defined in `.cursor/rules/700-task-planning-agent-orchestration.mdc`:

- **Simple Extension Features**: Basic Working Flow → Complete (1 phase)
- **Complex Features**: Core Flow → Error Handling → Advanced Features (3 phases)
- **Architectural Features**: Minimal Integration → Core Logic → Advanced Features → Complete (4 phases)

<critical>
The phase strategy is based on RISK and DEPENDENCY, not just feature size. A small feature that introduces new patterns may need more phases than a large feature following established patterns. Each phase must deliver working functionality the user can test.
</critical>

### Implementation Block Creation

Create implementation blocks following this structure:

**Block Template**:

```markdown
## Implementation Phase X: [Phase Name]

**Requirements for This Phase**:

- [Specific PRD requirements that must be implemented in this phase]
- [Business rules that apply to this phase's scope]
- [Data requirements for this phase]
- [Error handling requirements for this phase]

**Deliverable**:

- [Specific, testable working functionality user can interact with]
- [How user can test and verify this phase works]

**Validation Point**:

- [What working functionality should be demonstrable]
- [Specific user actions that should work]
- [Evidence that approach is sound for next phase]

### Tasks:

[List of related tasks for this functional slice]

### Self-Check Criteria:

[Specific validation steps agents should perform to verify working functionality]

**STOP HERE - AWAIT VALIDATION**
```

**Functional Slice Focus**: Reference `.cursor/rules/700-task-planning-agent-orchestration.mdc` for complete functional slice principles.

### Task Boundary Definition

### Complete PRD Requirement Transfer

<critical>
Every functional requirement from the PRD must be explicitly included in task blocks. Implementation agents do not have access to the PRD, so missing requirements = missing implementation.
</critical>

**Universal Principles**:

- All user-facing functionality must be explicitly documented
- All business rules and conditional logic must be clearly specified
- All data handling requirements must be captured
- All error scenarios and user feedback must be defined
- All validation rules must be included

**Implementation Guidance**:

- Focus on complete coverage rather than specific content types
- Ensure all PRD requirements have corresponding task implementation
- Document behavior, not just technical specifications

Within each block, create tasks that:

**Provide Clear Research Direction**:

```markdown
Research [specific-service] pattern (src/app/shared/services/[service-name].service.ts)
Focus on: [specific aspects relevant to the feature requirements]
```

**Define Implementation Scope**:

```markdown
**Implementation Scope**: This creates complete functionality following established patterns. All requirements should be properly implemented and testable.
```

**Reference Specific Constraints**:

```markdown
**Must Follow**:

- [applicable cursor rules]
- [exact patterns from referenced services]
- [architectural constraints identified in research]
```

**Avoid Micromanagement**:

- Don't specify exact method names or signatures
- Don't prescribe specific implementation details
- Focus on patterns to follow and outcomes to achieve

### Validation Point Design

For each checkpoint, define:

**Deliverable Statement**:

- Specific, testable outcome that can be verified
- Clear success criteria
- Example: "Service layer can handle all [feature] operations with proper error handling"

### Implementation Phase Scope Validation

<critical>
Self-check criteria must match the working functionality scope of each phase exactly. Each phase should deliver testable end-to-end functionality within its defined slice.
</critical>

**Before creating self-check criteria, ensure**:

- **Working functionality focus**: Validate what the user can actually do and test
- **End-to-end scope**: Even minimal phases should work from user action to visible result
- **Incremental complexity**: Later phases build upon and enhance earlier working functionality

**Common Scope Violations to Avoid**:

- Creating phases that only set up infrastructure without working user functionality
- Asking about features not yet implemented in the current phase scope
- Validating architectural completeness instead of working user flows

**Validation Questions Template**:

```markdown
**Self-Check Before Checkpoint**:

- [Question 1: Can user perform the main action this phase enables?]
- [Question 2: Does the working functionality match the deliverable exactly?]
- [Question 3: Are the testable outcomes clearly demonstrable?]
- [Question 4: Is the foundation solid for building the next functional slice?]
```

**Failure Impact**:

- Explain why this checkpoint matters for user-testable functionality
- What working features break if this isn't solid
- Example: "If This Fails: Users can't complete the basic flow, making advanced features meaningless"

### Planning Summary & Completion

Create a final summary including:

**Selected Strategy**: [Simple/Complex/Architectural] with [X] phases
**Rationale**: Why this functional slice approach was chosen

**Implementation Phases Overview**:

- Phase 1: [Name] - [Working functionality delivered]
- Phase 2: [Name] - [Additional working functionality delivered]
- etc.

**Risk Mitigation**:

- How user-testable checkpoints prevent major rework
- What functionality failures are being caught early through validation

**Efficiency Considerations**:

- How functional slices deliver value incrementally
- How agents can work efficiently within testable boundaries

## Quality Assurance Requirements

Before completing this phase:

- Ensure functional slice strategy aligns with feature complexity and user validation needs
- Confirm implementation guidance provides clear boundaries without micromanagement
- Verify that phases deliver testable working functionality users can interact with

## Task Planning Completion Signal

When planning is complete, end with:

**[TASK PLANNING COMPLETE - READY FOR DOCUMENTATION]**

**Phase 2 Output**: Implementation phases with working functionality slices and user validation criteria
