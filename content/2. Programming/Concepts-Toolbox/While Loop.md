---
aliases: 
tags:
  - concept
---
## Notes and Info
- An [[Iteration|Iterative]] loop that ends based on a [[Boolean Expression]].
- Used when you don't know how many iterations it will take to complete the task.
- Sometimes governed by a [[Sentinel]] value, to avoid infinite looping.
- While loops can be attached to a single [[Statement]], or a [[Code Block]], though usually we use blocks.
- For Loops can be ended early using `break;`
- For Loops can skip to the next iteration using `continue;`
### Syntax
- while([[Boolean Expression]]) *statement*
- while([[Boolean Expression]]) { [[Code Block]] }
### Examples
```java
// while loop attached to a single statement
while(b.getWidth() > 20)
	b.setWidth(b.getWidth()-1);
	
// while loops attached to code blocks

while(true){
	// this loop is infinite
}

while(false){
	// this loop cannot run
}

// a while loop designed to work like a for loop
int i = 0;
while(i < 10){
	// do something
	i++;
}

boolean targetFound = false;
while(!targetFound){
	huntForTarget();
}

final int SENTINAL = 999;
int counter = 0;
while(!targetFound && counter < SENTINEL){
	huntForTarget();
}
```
