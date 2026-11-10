---
aliases: 
tags:
  - concept
---
Notes and Info

* An Iterative loop that ends based on a Boolean Expression, just like a [[While Loop]].
* The Boolean Expression is checked at the **end** of each iteration instead of the beginning, so the loop body always runs **at least once**.
* Used when the task has to happen once before you can know whether to repeat it (asking for input, rolling a die, showing a menu).
* Do-while loops can be attached to a single Statement, or a Code Block, though usually we use blocks.
* A do-while loop needs a semicolon after the Boolean Expression. A while loop does not.
* Do-while loops can be ended early using `break;`
* Do-while loops can skip to the next iteration using `continue;` (it jumps straight to the Boolean Expression check)

Syntax

* do statement while(Boolean Expression);
* do { Code Block } while(Boolean Expression);

Examples

```java
// do-while loop attached to a single statement
do
	b.setWidth(b.getWidth()-1);
while(b.getWidth() > 20);

// do-while loops attached to code blocks

do{
	// this loop is infinite
} while(true);

do{
	// this loop runs exactly once
} while(false);

// while vs do-while when the Boolean Expression starts out false
int x = 100;
while(x < 10){
	x++;	// never runs, x stays 100
}
do{
	x++;	// runs once, x becomes 101
} while(x < 10);

// rolling a die until you get a 6 (you have to roll before you can check)
int roll;
do{
	roll = (int)(Math.random() * 6) + 1;
} while(roll != 6);

// asking for input until it is valid
Scanner input = new Scanner(System.in);
int age;
do{
	System.out.print("Enter your age: ");
	age = input.nextInt();
} while(age < 0);
```