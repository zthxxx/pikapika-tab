# ECHOLY Language Specification v1.0

> Author @Obooman

## Document Introduction

ECHOLY is a domain specific language for describing application with UI.
Each ECHOLY document has 2 main part, [INTERACT] and [ACTIONS]
Indent in ECHOLY would be 2 spaces
ECHOLY files have a `.eco` extension

## [INTERACT] Part

[INTERACT] Part basic structure would be `ElementName [layout] properties`
Define the mainly user interface and element properties

1. Element Names

   - Must start with uppercase letter
   - Can contain letters and numbers
   - Examples: Page, Header, Button, FormInput

2. Layout Format

   - Enclosed in square brackets []
   - Space-separated
   - Empty brackets allowed
   - Examples: [flex], [flex-col w-100 h-20]

3. Layout Types enumerate
   a) Layout Properties

   - row
   - col
   - grow

   b) Dimension Properties

   - w-{number}: width in pixels
   - h-{number}: height in pixels

4. Properties Format

   - {propertyName}="{value}"
   - Multiple properties separated by space
   - Examples: onClick="提交" onInput="搜索"
   - propertyName can be anything, value would be a string
   - text should be a special property name, it shows on page
   - if the value has directive "#1.2", it means the value is in the action part, 1.2 and followed info.

5. Indentation Rules

   - 2 spaces per level
   - Child elements must be indented
   - Siblings must share same indentation

6. Grammar Rules
   document ::= element+
   element ::= indent elementName properties methods? newline children?
   elementName ::= [A-Z][a-zA-Z0-9]_
   properties ::= '[' (property ( ' ' property)_)? ']'
   property ::= layoutProp | dimensionProp
   layoutProp ::= 'row' | 'col' | 'grow'
   dimensionProp ::= ('w-' | 'h-') number
   methods ::= (method ' ')_ method
   method ::= methodName '="' value '"'
   methodName ::= 'onClick' | 'onInput' | 'onChange' | 'onSubmit'
   children ::= element+
   indent ::= ' '{2}_

7. Validation Rules

   - Element names must be unique within siblings
   - Properties must be valid and not duplicate
   - Indentation must be consistent
   - Parent-child relationships must be logical

8. Layout Behaviors

   - row: enables flex-box layout
   - col: vertical flex layout
   - grow: takes remaining space
   - w-{n}: fixed width in pixels
   - h-{n}: fixed height in pixels

9. Best Practices
   - Group related elements together
   - Use meaningful element names
   - Keep nesting depth reasonable (max 5-6 levels)
   - Align method declarations for readability
   - Use consistent naming conventions

## [ACTIONS] part

[ACTIONS] part Basic structure would be `index. [condition/case] tasks`
Define what would it be, with conditions or cases.

12. Formatting Specifications

    - Use numerical numbering (start from 1 at each level) to label each step.
    - Use a 2-space indent to indicate hierarchical relationships.
    - Use square brackets [condition] to mark branching conditions.
    - Ensure each action is specific and executable.

13. Descriptive Principles

    - Use concise natural language.
    - Each step should describe only one specific action.
    - Branching conditions should be clear and mutually exclusive.
    - Avoid using technical implementation details.

14. Structural Requirements

    - Top-level numbering represents independent interactive behaviors.
    - Sub-level numbering represents conditional branches or sub-steps.
    - Support up to 6 levels of numbering.
    - Related actions should be grouped together.

15. Complete Example:

```
[INTERACT]
Page [col]
  Header [row h-20]
    Logo [w-100] onClick="open homepage"
    SearchInput [grow] text="Input text and enter to search"
    SearchBar [w-40] text="Search" onClick="Search the docs"
    UserMenu [w-200]
  Content [row]
    Sidebar [w-240 flex-col]
      MenuItem [] text="menu 1"
      MenuItem [] onClick="menu 2"
    MainContent [col grow]
      Title [] text="Register"
      Form [col]
        Input [] text="Please input username"
        Button [] onClick="#1" text="submit"

[ACTIONS]
1. Submit the form to backend service
  1. [username length more than 10] no pass, tell user the username is too long
  2. [username length less than 10] check name confliction
    1. [name conflict] no pass, tell user the username has been took
    2. [name no conflict] pass, submit successfully, jump to login
```
