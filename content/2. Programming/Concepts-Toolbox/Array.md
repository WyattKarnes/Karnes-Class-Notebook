---
aliases:
  - Arrays
tags:
  - concept
---
## Notes and Info
- Reference [[Data Types.canvas|Data Types]] that can store [[Element|Elements]] of similar types.
- A simple form of [[Data Structure]].
- Can be multi-dimensional.
- Common source of [[Null Reference Exception]] when not [[Initialization|Initialized]] properly.
- Are accessed using a combination of their [[Identifier]] and an index number. 
- The indices of an array ==begin at 0== and ==end at one less than the number of elements in the array (length)==.
### Syntax
#### Creation
- [[Modifier|Modifiers]] [[Data Types.canvas|Data Type]] `[]` [[Identifier]]; (Declaration only)
- [[Modifier|Modifiers]] [[Data Types.canvas|Data Type]] `[]` [[Identifier]] = new [[Data Types.canvas|Data Type]]`[#]`; (Initialization to an empty array)
- [[Modifier|Modifiers]] [[Data Types.canvas|Data Type]] `[]` [[Identifier]] = {[[Sources of Values|Value]], [[Sources of Values|Value]], [[Sources of Values|Value]], ...}; (Initialize with default values)
#### Usage
- [[Identifier]]`[#]`; (retrieving a value from the array)
- [[Identifier]]`[#]` = [[Sources of Values|Value]]; (assign a new value to an array index)
- [[Variable]] = [[Identifier]]`[#]`;
### Examples
```java
// declaration only
private int[] numbers;

// declaration and initialization of an empty array
private String[] words = new String[5];

// declaration with initialization later
private String[] words2;
words2 = new String[5];

// declaration and initialization of a non-empty array
private float[] floats = {8.2f, 3.6f, 10f, 56.32f};

// accessing an array index
floats[1];

// assigning a value to an array index
float ex = floats[3];

// passing the value of an array index into a method
example(words[2]);

// calling a method on an instance stored in an array
GRect[] bricks = {new GRect(20,20), new GRect(45, 60)};

bricks[1].setFilled(true);

// finding the length of an array
words.length;

// using the length of an array in a for loop
for(int i = 0; i < words.length; i++){
	System.out.println(words[i]);
}
```
