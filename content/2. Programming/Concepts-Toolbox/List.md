---
aliases: 
tags:
  - concept
---
## Notes and Info
- A linear data structure that allows easy insertion, deletion, searching, and sorting.
- Unlike an [[Array]], lists are [[Mutable]] (they can grow and shrink in size).
- Lists come in many forms. ArrayLists, LinkedLists, Doubly Linked Lists, etc. 
### Syntax
#### Creation
- ListType<Reference [[Data Types.canvas|Data Type]]> [[Identifier]];
- ListType<Reference [[Data Types.canvas|Data Type]]> [[Identifier]] =  new ListType<>();
#### Usage
>[!info]
>Please note that these methods exist for all types of Listm because Lists are an interface.

- [[Identifier]].add([[Sources of Values|Value]]); (add an element to the end of the list)
- [[Identifier]].add(index, [[Sources of Values|Value]]); (insert an element at the given index)
- [[Identifier]].remove(index); (remove the element at the given index)
- [[Identifier]].remove([[Sources of Values|Value]]); (search for and remove the given value)
- [[Identifier]].set(index, [[Sources of Values|Value]]); (replace the value of an element with a new value)
- [[Identifier]].get(index); (retrieves the value of a given index)
- [[Identifier]].contains([[Sources of Values|Value]]); (search for a value, return true if found)
- [[Identifier]].indexOf([[Sources of Values|Value]]); (returns the index of a value, if it exists. Returns -1 if it doesn't.)
- [[Identifier]].size();
### Examples
```java

```
### See Also
- [[Array List]]
- [[Linked List]]
