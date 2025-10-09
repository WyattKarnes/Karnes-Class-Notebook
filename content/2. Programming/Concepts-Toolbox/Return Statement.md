---
aliases:
  - Return Statements
tags:
  - concept
---
## Notes and Info
- Act as the output of a [[Method]].
- When a return statement is reached the method will end. This can be done per requirement, or it can be done to end the method early on purpose.
- If the method is not declared [[Return Type#^4620f3|void]], then there **MUST** be at least one return statement.
- Void methods **CAN** have return statements, but they are not required.
- The [[Sources of Values|Value]] that is returned **MUST** match the [[Return Type]] that was declared.
- If the method has multiple [[Code Paths]], each path **MUST** have its own return statement.
### Syntax
#### If the method is...
##### Void
- return;
##### Not Void
- return [[Sources of Values|Value]];
### Examples
```java
//...
```
