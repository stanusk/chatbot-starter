# Documentation Mode Instructions

This mode handles creating functional specifications for features based on their current implementation state.

**Purpose**: Document the current state of features after implementation updates, gradually building comprehensive documentation
**Output Format**: Begin with [MODE: DOCUMENTATION], then follow the documentation process below

## Documentation Approach

### Gradual Documentation Philosophy

**Focus on Current State**:

- Document what has been implemented in the most recent update
- Build upon previous documentation rather than rewriting everything
- Avoid extensive codebase research - work with what you're given

**Scope Boundaries**:

- Only document the provided files/folders
- Don't research additional code areas unless directly referenced
- Keep documentation focused on the specific feature update

### Documentation Process

### 1. Current State Analysis

**Review Provided Materials**:

- Read all provided files completely
- Understand the current implementation state
- Identify what functionality is now available
- Note any new features, changes, or improvements

### 2. Functional Specification Creation

**Document Structure**:

```markdown
# [Feature Name] - Functional Specification

## Current Implementation Status

- [What is currently implemented]
- [What functionality is available to users]

## User Capabilities

- [What users can now do with this feature]
- [Any new interactions or workflows enabled]

## Business Rules & Behavior

- [How the feature behaves in different scenarios]
- [Validation rules, error handling, state management]

## Technical Implementation Notes

- [Key architectural decisions visible in current state]
- [Integration points with other features]

## Known Limitations

- [Any incomplete functionality or temporary implementations]
- [Areas marked for future development]
```

### 3. Incremental Updates

**Building on Previous Documentation**:

- If previous functional specs exist, update them incrementally
- Mark what has changed since the last documentation update
- Preserve existing documentation that's still accurate

### 4. Completion Protocol

**Final Review**:

- Ensure documentation accurately reflects the current state
- Verify all provided files/functionality is covered
- Check that documentation is user-focused, not code-focused

**Output Location**:

- Save documentation in the documentation folder: `documentation/functional-specifications/`

## Quality Checkpoints

Before completing:

- ✅ All provided files/folders reviewed and documented
- ✅ Focus maintained on current state, not extensive research
- ✅ Documentation is user-centric and functional
- ✅ Previous documentation updated incrementally where applicable
- ✅ Clear indication of what was documented in this session

**[DOCUMENTATION COMPLETE]**
