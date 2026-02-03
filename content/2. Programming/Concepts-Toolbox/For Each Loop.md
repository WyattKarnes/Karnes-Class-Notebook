---
aliases:
  - Enhanced For Loop
tags:
  - concept
---
## Notes and Info
- A type of [[Iteration|Iterative]] loop which makes traversing a collection easy and quick.
- There are some notable pitfalls in a for each loop:
	- Can only traverse forwards.
	- Elements are *copied* instead of being directly accessed, therefore elements **cannot** be changed within the loop. Thus, reassignment does not work.
		- In practice this means that enhanced for loops can only be used to read information out of an Array, not to change the information in the Array.
	- Commonly a source of [[Concurrent Modification Exception]] when adding to or removing from the collection.
### Syntax
- for ([[Data Types.canvas|Data Type]] [[Identifier]] : Collection) {*code*}
- In English we can read this is for EACH [[Data Types.canvas|Data Type]] IN Collection
### Examples
```java
for(Integer x : list){
	print(x);
}

// DO NOT DO THIS - YOU ARE EDITING A COPY
for(String s : list2){
	s = "Problem";
	print(s);
}

// DO NOT DO THIS - Concurrent Modification Exception!
for(String s : list3){
	if(s.equals("something")){
		list3.remove(s);
	}
}
```
