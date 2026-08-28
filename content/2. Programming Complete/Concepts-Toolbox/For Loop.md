---
aliases: 
tags:
  - concept
---
## Notes and Info
- An [[Iteration|Iterative]] loop that we use when we "know" how many times we want to repeat.
- Contains 3 parts:
	- An iterator, `int i = 0`, which tracks the [[Iteration|Iterations]] the loop has been through.
	- A [[Boolean Expression]], `i < ?`, which tells the loop when to stop.
	- An increment statement, `i++`, which defines how to change the iterator each cycle.
- *Note: The parts of the loop can be customized, but also have common ways of being written. It is up to you as an engineer to decide how to change them.*
- For Loops can be attached to a single [[Statement]], or a [[Code Block]], though usually we use blocks.
- For Loops can be ended early using `break;`
- For Loops can skip to the next iteration using `continue;`

### Syntax
- for(Iterator; [[Boolean Expression]]; Increment) *[[Statement]]*
- for(Iterator; [[Boolean Expression]]; Increment) {[[Code Block]]}

### Examples
```java
// for loop attached to a single statement
for(int i = 0; i < 10; i++)
	System.out.println("Here we go " + i);
	
// for loops attached to blocks
for(int i = 0; i < 10; i++){
	// your code here
}

for(int i = 0; i <= 10; i++){
	// be careful of the difference between <, <= and >, >=
}

for(int i = 10; i > -1; i--){
	// this loop has been configured to count *down*
}

for(int i = 0; i < 10; i++){

	for(int j = 0; j < 10; j++){
	
		// nested loop example
		// note the change in iterator name
		// IMPORTANT: This inner loop will run 10x for every 1x the outer loop runs
	
	}

}
```
