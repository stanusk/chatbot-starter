# PRD Creation Instructions

These instructions guide the documentation phase of PRD creation, where you transform the gathered context and information into a comprehensive PRD document.

- Purpose: Documentation creation ONLY
- Permitted: Creating and organizing documentation based on gathered information
- Forbidden: Gathering new information, asking questions, making assumptions
- Requirement: You may ONLY document what was explicitly gathered in the previous phase
- Output Format: A structured PRD document following the template below always in English language (With the exceptions that follow our localization rules for user-facing text or for how we call any particular functions or API endpoints in Czech language in our codebase)

## Document Creation Process

Create a new document named [task-code]-prd.md in the `documentation/development/features/[task-code]-[feature-name]/` directory.

Either I have provided you with the task code, an example of which would be `DIP-158`, or you should have received it in the previous phase.

The feature name should have been determined during the context gathering phase.

Example: `DIP-158-messaging-unread-counter-uhazec`

## CRITICAL PRD CREATION RULES

**Implementation Details Prohibition:**

- **NEVER describe implementation details when the user provides reference patterns** - Simply reference the pattern to follow
- If user says "follow X service pattern exactly", write "Follow X service pattern exactly" - do NOT elaborate on intervals, methods, or technical specifics
- Reference patterns are for the implementation agent, not for you to dissect

**Conciseness Requirement:**

- **Be concise and avoid redundant explanations** - State requirements clearly following closely what seemed to be important in your inputs without over-elaboration and without adding any additional requirements that were not explicitly mentioned or confirmed during the context gathering phase
- Consolidate related information instead of creating separate verbose sections

**Specific References:**

- **Reference specific cursor rules by name** (e.g., `general/002-localization`) instead of vague descriptions if you were pointed towards rules during context gathering phase
- **Reference specific files and services by exact path** when mentioning patterns to follow

**Content Restrictions:**

- **ONLY include risks and requirements explicitly mentioned by the user or confirmed during context gathering phase** - Do not extrapolate concerns
- **ONLY include functionality explicitly requested or confirmed during context gathering phase** - Do not add features or capabilities

### PRD Section Guidelines

#### Title

- Keep it concise but descriptive
- Include feature type for clarity (e.g., "Skola Authentication Update" rather than just "Authentication")

#### Overview (2-4 sentences)

- Summarize what the feature is at a high level
- Explain why it's being built (the core purpose)

#### Scope (2 subsections)

**Included**

- List specific functionality that will be built
- Be explicit about feature boundaries

**Excluded**

- List specific functionality that will NOT be built
- Clarify potential misconceptions or expectations

#### User Stories / Use Cases

- Follow the standard format: "As a [role], I want to [action] so that [benefit]"
- Cover the primary user interactions with the feature
- Include edge cases and alternative flows where relevant
- Ensure stories are concrete and testable
- **Keep concise** - avoid over-explaining obvious benefits

#### Requirements

**Functional Requirements (comprehensive list)**

- Describe what the system MUST do
- Make requirements specific and verifiable
- Include acceptance criteria where helpful
- **Avoid redundant sub-bullets** - consolidate related requirements

**Non-functional Requirements (as applicable)**

- Include any technical or existingcodebase related constraints that were identified during analysis
- Include performance expectations, security requirements, ...
- Include technical constraints that _define the boundaries or essential characteristics_ of the feature (e.g., 'Must be compatible with existing `JpzCertisExportService` polling pattern', 'API calls must use JWT authentication'). Avoid specifying implementation details that are choices rather than constraints.

#### Existing Codebase References

- List all related components, services, data models, types, and utilities identified in the codebase analysis
- Explain their significance in the upcoming change
- **When referencing patterns to follow, use exact file paths and emphasize with "MUST FOLLOW THIS EXACT PATTERN"**

#### Dependencies

- Specify any external tools or libraries needed
- **ONLY include non-obvious dependencies** - omit standard framework components

#### API Documentation References

If the feature requires API integration:

- Reference the relevant API documentation in `/documentation/API/`
- Document which specific endpoints will be used or created

**Note**: Rather than duplicating API documentation, reference the existing documentation created by the API Documentation Agent, providing additional context that was gathered and is not contained in the documentation.

#### Risks

- Identify technical challenges, potential user adoption challenges, compliance or security concerns, ...
- **ONLY include risks explicitly mentioned by the user or critical system limitations discovered during analysis**

#### Important Observations

- Capture any important details shared during the context gathering phase that weren't already referenced in other sections
- Include any critical information that was emphasized during discussions

### PRD Template

```markdown
# [Title] - PRD

## Overview

[2-3 sentences explaining what the feature is and why it's being built]

## Scope

### Included

- [Item 1]
  ...

### Excluded

- [Item 1]
  ...

## User Stories / Use Cases

- As a [role], I want to [action] so that [benefit].
  ...

## Requirements

### Functional Requirements

1. [Requirement 1]
   ...

### Non-functional Requirements

1. [Requirement 1]
   ...

## Existing Codebase References

### Related Components, Services, Data Models, Types, and Utilities

- [Component 1] - Location: [file path] - Purpose and relevance to the feature
- [Service 1] - Location: [file path] - Purpose and relevance to the feature
- ...

### API Documentation References

List all relevant API documentation found:

- [API Endpoint 1] - Location: /documentation/API/[entity_name]/[filename].md - Relevance to feature
- ...

## Risks

- [Risk 1]
  ...

## Important Observations

- [Observation 1]
  ...
```

**Critical**:

## Instructions Usage Tracking

Instructions ID: prd_creation-149
