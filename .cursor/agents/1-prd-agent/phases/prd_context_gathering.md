# Context Gathering Instructions

These instructions guide the initial phase of PRD creation, where you analyze both user input and the codebase to create a comprehensive context for the feature.

- Purpose: Information gathering ONLY
- Permitted: Reading files, asking clarifying questions, understanding code structure
- Forbidden: Suggestions, implementations, planning, documentation creation
- Requirement: You may ONLY seek to understand what needs to be implemented and why
- Output Format: Begin with [PHASE: CONTEXT GATHERING], then based on the instructions below
- Focus on defining the problem and the required outcome, not on prescribing the specific technical solution or UI component choices. These are tasks for later planning and implementation phases.

## Context Gathering Process

- Always start by reading the entire file `documentation/about-project.md` in order to understand the context of the project and the overall architecture
- Our objective is to get our sufficient understanding of what we are planning to implement in order to write a comprehensive PRD document

**Context Gathering Steps**

You are to follow these steps in the current phase to achieve your objectives:

1. Codebase analysis
2. Provided Context Analysis
3. Question Generation
4. Requesting and waiting for answers from the user

Below are further instructions for those steps to be followed to the letter.

### Codebase Analysis

- Your objective here is to read the suggested files in order to understand any functional or technical constraints directly related to the feature for which you are creating the PRD document
- If I pointed you towards reading the API documentation, check out `/documentation/API/endpoints_summary.md` and any relevant endpoints in `/documentation/API/`
- **CRITICAL: Read API documentation thoroughly** - If I know that there are important rules in the API documentation that I pointed you towards I do not repeat them and I expect you to get them from the endpoints documentation
- Some of the files that I pointed you to might not contain any constraints or additional requirements and might only be important for later in the process when the implementation agent needs to understand particular patterns that we use
- Your role is not to analyze or implement any such patterns, but only to understand the high level functional and technical constraints and requirements
- Your role is not to do any codebase analysis outside of the bounds of the files and folders that I specifically provided you with, unless I explicitly told you to find similar patterns in the code base

### Provided Context Analysis

- You can safely assume that all the information I provided you with are crucial for correct implementation of the feature and none should be ignored
- You can also safely assume that I did not provide you with everything that is needed to do so and your task is to poke me to find and understand the stuff I left out
- **CRITICAL: Do NOT extrapolate or add functionality** - Only ask about what was explicitly mentioned or what is missing from what was mentioned
- You need to think critically and analytically about what implementing a feature that I described in a project like this requires and what specifications are needed in order to implement it correctly
- If you do not have all of those specifications your role is to ask for further clarification

### Question Generation Framework

Organize your questions according to the PRD sections they relate to:

When formulating questions, ensure they aim to clarify functional requirements, scope, user needs, and business rules. Avoid questions that delve into specific implementation choices (e.g., 'Should we use X component for this?' or 'What should be the exact polling interval in milliseconds?'), unless a specific technical constraint is already known and needs clarification of its impact.

**Scope Questions**

- Focus on feature boundaries
- Clarify what is included vs. excluded
- Example: "(Scope) Will this implementation affect the uchazec part or does it also affect the skola side? ?"
- Example: "(Scope) Should this feature be available to all user roles, or restricted to admin users only?"

**User Stories Questions**

- Focus on specific user interactions and scenarios
- Clarify different use cases for the feature
- Example: "(User Stories) When a user adds an item to a collection, should they be able to modify its category afterwards?"

**Requirements Questions**

- Focus on functional and non-functional details _necessary to define the feature's behavior and constraints_.
- Separate technical requirements from user-facing functionality
- Example: "(Requirements) What is the maximum file size we need to support for uploads in this feature?"
- Separate technical requirements (e.g., 'The system must integrate with X API') from user-facing functionality. Defer detailed technical implementation decisions (e.g., specific library choices, precise algorithm for a non-core function) to the planning/implementation phase unless it's a fundamental constraint provided by the user or discovered as a critical system limitation.

**References Questions**

- Focus on understanding the context of the feature
- Clarify the reasons why referenced files or folders were provided
- Example: "(References) Will we be extending the provided [Service x] or just use it as a reference for creating a new one?"
- Example: "(References) Will this feature need to interact with the user notification system which was mentioned?"

**Risks Questions**

- Focus on potential challenges or edge cases
- Clarify how to handle exceptional situations
- Example: "(Risks) How should the system handle conflicts if two users edit the same record simultaneously?"

#### Prioritizing Questions

Limit your questions to the most important ones that will significantly impact the PRD. Aim for:

- 3-5 high-priority questions for small features
- 5-8 high-priority questions for medium-sized features
- 8-12 high-priority questions for large, complex features

### Requesting and waiting for answers from the user

- You are to request answers from me in a structured manner and wait for my response
- I might not provide the answers to all of your questions
- You are safe to assume that any question that I did not answer is not important for implementing this feature and can be omitted from the documentation process entirely

**Critical**:

## Instructions Usage Tracking

Instructions ID: prd_context_gathering-148
