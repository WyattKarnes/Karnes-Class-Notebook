---
aliases:
  - Mutator
  - Setter
tags:
  - vocab
---
## Definition
- A "special" [[Method]] that is used to control the [[Assignment Statement|Assignment]] of a [[Variable]].
- The [[Identifier]] will usually contain the word "set" and the identifier of the variable in question. Hence "setter".
- Will also usually have at least one [[Parameter]] for passing in the [[Sources of Values|Value]] to assign.
### Examples
```java
public class Person {

	// data we want to change
	private int age;
	
	// mutator/setter method
	public void setAge(int newAge){
		if(newAge < 0){
			age = 0;
		} else if(newAge > 125){
			age = 125;
			callGuinness();
		} else {
			age = newAge;
		}
	}

}
```
### See also
- [[Mutator Method]]