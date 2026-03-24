---
aliases:
  - Override
tags:
  - vocab
---
## Definition
- The ability to replace the body of a pre-existing [[Method]] with a new version. 
- Sometimes methods are designed around doing this, such as with `toString()`.
- To override a method, you create a method with the same [[Return Type]], [[Identifier]], and [[Parameter|Parameters]] as the method you want to override.
- You can override pretty much any method as long as it is not [[Modifier|static]] or [[Modifier|final]]. 
### Examples
```java
/* 
The "@Override annotation" is not required, but it makes it obvious that the method was overriden at a glance.
*/

@Override
public String toString(){
	return "I am replacing the default.";
}
```
### See also
