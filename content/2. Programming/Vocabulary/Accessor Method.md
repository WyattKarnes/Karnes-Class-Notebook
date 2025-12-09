---
aliases:
  - Getter
  - Accessor
tags:
  - vocab
---
## Definition
- A "special" [[Method]] that is used to return the value of a private [[Variable]].
- Usually the [[Identifier]] of the method will have "get" and the identifier of the variable in it. Hence "getter".
- Usually getters return the same [[Data Types.canvas|Data Type]] as the variable in question.
### Examples
```java
public class MyClass {
	
	// data we want to access
	private String secret;
	
	// accessor method
	public String getSecret(){
		return secret;
	}

}
```

### See also
- [[Mutator Method]]