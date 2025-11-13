---
aliases:
  - Overloaded
tags:
  - vocab
---
## Definition
- Allows the creation of multiple [[Method|Methods]] or [[Constructor|Constructors]] with the same name.
- This is allowed as long as the [[Parameter|Parameters]] are of a different amount and/or type.
- Java will intelligently figure out which version of the method or constructor to call based on the [[Argument|Arguments]] you provide.
### Examples
```java
// method overloading
private int add(int a, int b){
	return a + b;
}

private int add(int a, int b, int c){
	return a + b + c;
}

private long add(long a, long b){
	return a + b;
}
```
### See also
