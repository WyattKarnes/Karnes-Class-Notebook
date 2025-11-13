---
aliases: 
tags:
  - concept
---
## Notes and Info
- Allows an [[Instance]] to refer to itself in the third person.
- This is used to reduce ambiguity between [[Instance]] [[Variable|Variables]] and [[Parameter|Parameters]] that share the same identifier.
- It also allows you to call one [[Constructor]] from another in the same class.
### Syntax
- `this`
### Examples
```java
public class Example {

	private String name;
	private int ID;
	
	// Default empty constructor
	public Example(){
		this("Your mom");
	}
	
	// Constructor with one parameter
	public Example(String name){
		this(name, 8675309)
	}
	
	// Continued overloading
	public Example(String name, int ID){
		this.name = name;
		this.ID = ID;
	}
}
```
