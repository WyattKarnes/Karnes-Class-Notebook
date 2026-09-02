---
aliases:
  - Constructors
tags:
  - concept
---
## Notes and Info
- A special [[Method]] that [[Instantiation|Instantiates]] an [[Object]] in memory.
- Often used to set default values for [[Instance]] [[Variable|Variables]]. In other words, constructors "set up the class".
- There is a default constructor in every class. It is empty, has no [[Parameter|Parameters]], and is also invisible.
- Constructors can be [[Overloading|Overloaded]] like methods, allowing for multiple constructors in one class.
### Syntax
#### Writing Constructors
- [[Modifier|Modifiers]] NameOfTheClass([[Parameter|Parameters]]) { *code* }
#### Calling Constructors
- `new` NameOfTheClass([[Argument|Arguments]]);
### Examples
```java
public class Example {

	private String name;
	private int ID;
	
	// Default empty constructor
	public Example(){
	
	}
	
	// Constructor with one parameter
	public Example(String name){
		
	}
	
	// Continued overloading
	public Example(String name, int ID){
		name = name;
		ID = ID;
	}
}


// Examples of calling constructors
public class Main {

	public static void main(String[] args){
		new Example();
		new Example("Some name");
		new Example("Some name", 8675309);
		
		Example one = new Example();
		Example two = new Example("Some name");
		Example three = new Example("Some name",8675309);
	}

}
```
