---
aliases: 
tags:
  - concept
---
## Notes and Info
- A type of [[List]] that is backed by an [[Array]].
- In reality, this is an implementation of the [[List]] [[Interface]] that wraps an [[Array]] and gives it additional abilities.
- Pros: **Very fast lookup times**
- Cons: **Slow insertion and deletion**
### Syntax
- ArrayList<Reference [[Data Types.canvas|Data Type]]> [[Identifier]] = new ArrayList<>()
### Examples
```java
ArrayList<String> strings = new ArrayList<>();

strings.add("Hello"); // Content: Hello
strings.add(0, "World"); // Content: World Hello

strings.remove("Hello"); // Content: World
strings.remove(0); // Content:

strings.set(0, "You"); // Content: You

strings.get(0); // returns "You"

strings.contains("Father Figure"); // returns false
strings.contains("You"); // returns true

strings.indexOf("You"); // returns 0
strings.indexOf("Something"); // returns -1
```