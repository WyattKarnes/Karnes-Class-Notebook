---
aliases: 
tags:
  - concept
---
## Notes and Info
- An [[Iteration|Iterative]] loop that ends based on a [[Boolean Expression]].
- Used when you don't know how many iterations it will take to complete the task.
- While loops need a way to end, or they loop forever. The common ways are:
* Every while loop needs a way to end, or it loops forever. The common ways are:
   * Counter Controlled: stops after a set count, much like a for-loop. `while(i < 10)`
   * Sentinel Controlled: stops when a special input like -1 appears. `while(score != SENTINEL)`
   * Flag Controlled: stops when a boolean changes. `while(!targetFound)`
   * Sometimes we add a limit stored in a constant, like `MAX_ATTEMPTS`, as a backup in case the loop never ends on its own.
- While loops can be attached to a single [[Statement]], or a [[Code Block]], though usually we use blocks.
- While Loops can be ended early using `break;`
- While Loops can skip to the next iteration using `continue;`
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

// a loop limit: stops after 999 tries even if the target is never found
final int MAX_ATTEMPTS = 999;
int attempts = 0;
while(!targetFound && attempts < MAX_ATTEMPTS){
	huntForTarget();
	attempts++;
}

// a sentinel value: the user types -1 to say "I'm done"
final int SENTINEL = -1;
Scanner input = new Scanner(System.in);
int total = 0;
int score = input.nextInt();
while(score != SENTINEL){
	total += score;
	score = input.nextInt();
}
```
