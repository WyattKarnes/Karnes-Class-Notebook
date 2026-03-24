---
aliases:
  - If Statements
  - If
tags:
  - concept
---
## Notes and Info
- The most common [[Conditional Statement|Conditional]], which enables the running of specific lines or blocks of code and is highly customizable.
- Can work on individual [[Statement|Statements]] or with [[Code Block|Code Blocks]], though usually we use code blocks.
- You can have as many `else if()` sections as you want in a chain after the original `if`, but if you want a plain `else`, it must come last.
- Can be nested.
- *Note: In a chain of if, if-else, if-else, if... when multiple conditions are true, ==only the FIRST true statement or block will run.== The rest will be skipped.*
### Syntax
---
#### Without Blocks
- `if`([[Sources of Values|Boolean Value]]) *statement*
- `if`([[Sources of Values|Boolean Value]]) *statement* `else` *statement*
- `if`([[Sources of Values|Boolean Value]]) *statement* `else if`([[Sources of Values|Boolean Value]]) *statement* `else` *statement*
---
#### With Blocks
- `if`([[Sources of Values|Boolean Value]]) {`code`}
- `if`([[Sources of Values|Boolean Value]]) {`code`} `else` {`code`}
- `if`([[Sources of Values|Boolean Value]]) {`code`} `else if`([[Sources of Values|Boolean Value]]) {`code`} `else` {`code`}
### Examples
```java
// without blocks
if(x == 10) 
	System.out.println("X is 10");
	
if(x < 10)
	System.out.println("X less than 10");
else
	System.out.println("X >= 10");	
	
if(health >= 50)
	System.out.println("Lookin good.");
else if(health > 0)
	System.out.println("You don't look too good");
else
	System.out.println("You am dead");

// with blocks
if(y > 1 && y <= 10){
	// do something....
	// multiple lines if you want!
}

if(y != x){
	// code if true
} else {
	// code if false
}

if(y < (x+2) || y > 5){
	// code if true
} else if(y > 2) {
	// code if the first wasn't true, but this is
} else {
	// code if neither is true
}

// other boolean value examples
if(player.isVampire()){
	System.out.println("Good lord you are pale.");
}

if(isSick){
	System.out.println("I'm not going to school.");
}
```
