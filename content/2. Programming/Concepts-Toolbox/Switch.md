---
aliases:
  - Switch Statement
tags:
  - concept
---
## Notes and Info
- A [[Control Statement]] that allows a [[Variable]] to be tested for equality against a list of values.
- Each value is called a **case**, and the variable being switched on is checked for each case.
- It is often used as a cleaner alternative to a long chain of `if-else if-else` statements.
- The `switch` works with `byte`, `short`, `char`, and `int` primitive [[Data Types.canvas|Data Types]]. It also works with `String` and `Enumerated` types.
- The `break` statement is used to "exit" the switch block. Without it, the code will "fall through" to the next case.
- The `default` case is optional and runs if none of the cases match the input.
### Syntax
#### Basic Switch
`switch`([[Variable]]) {
	`case` [[Sources of Values|Value]] 1:
		// code to execute
		`break;` (optional)
	`case` [[Sources of Values|Value]] 2:
		// code to execute
		`break;` (optional)
	`default`:
		// code to be executed if no cases match
}
### Examples
```java
// Using a switch to handle menu input
int choice = scr.nextInt();

switch (choice) {
    case 1:
        System.out.println("Continuing to next room...");
        break;
    case 2:
        exploreRoom(currentRoom);
        break;
    case 3:
        System.out.println("Exiting dungeon.");
        summarize();
        break;
    default:
        System.out.println("Invalid selection.");
        break;
}

// Switching on a String
String direction = "North";
switch (direction) {
    case "North":
        player.moveUp();
        break;
    case "South":
        player.moveDown();
        break;
}
```
