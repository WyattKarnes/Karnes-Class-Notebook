---
aliases:
  - Method Calls
tags:
  - concept
---
## Notes and Info
- Calling a [[Method]] means using its [[Identifier]] to tell it to run when you want it to.
- If a method has [[Parameter|Parameters]] you **MUST** provide [[Argument|Arguments]] when you call it.
### Syntax
#### If the method you want to call is...
---
##### In the same class:
- methodName([[Argument|Arguments]]);
---
##### In another class and NOT static:
- instanceName.methodName([[Argument|Arguments]]);
- Note: In order to do this, you MUST have an [[Instance]] of the [[Class]] the [[Method]] was originally declared in, and the method must be [[Public or Default]].
---
##### In another class and IS static:
- ClassName.methodName([[Argument|Arguments]]);
### Examples
```java
//...
```
