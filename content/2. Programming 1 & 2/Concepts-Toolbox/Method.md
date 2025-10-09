---
aliases:
  - Methods
tags:
  - concept
---
## Notes and Info
- A named group/block of programming statements.
- A reusable, run on demand block of code designed to accomplish a specific task.
- Use [[Parameter|Parameters]] to accept inputs from other methods when [[Method Call|Called]].
- Use [[Return Statement|Return Statements]] to give output back to the method that called it.
- Used to describe behaviors of objects in [[Object Oriented Programming|OOP]].
- Methods only run when they are called.
### Syntax
- [[Return Type|ReturnType]] [[Identifier]]([[Parameter|Parameters]]) {body/code}
### Examples
```java
// void method, no parameters
void example(){
	// code
}

// void method, with parameter
void printName(String name){
	System.out.println(name);
}

// int method, two parameters
int addTwoNumbers(int a, int b){
	return a+b;
}
```
