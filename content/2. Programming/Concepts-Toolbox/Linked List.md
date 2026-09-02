---
aliases: 
tags:
  - concept
---
## Notes and Info
- A type of [[List]] that is backed by interconnected node objects.
- Pros: **Fast insertion and deletion**
- Cons: **Slower lookup times**
### Syntax
- LinkedList<Reference [[Data Types.canvas|Data Type]]> [[Identifier]] = new LinkedList<>();
### Examples
```java
LinkedList<String> strings = new LinkedList<>();

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
