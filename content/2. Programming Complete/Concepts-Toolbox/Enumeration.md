---
aliases:
  - Enum
  - Enumerate
  - Enumerations
  - Enums
tags:
  - concept
---
## Notes and Info
- An **Enum** (short for "enumeration") is a special "class" that represents a group of **constants** (unchangeable [[Variable|Variables]], like [[Modifier|Final]] variables).
- Use enums when you have values that you know aren't going to change, like month names, days of the week, deck colors, or game states (e.g., `START`, `PLAYING`, `GAMEOVER`).
- Enums improve **type safety** and make your code more readable by replacing "magic numbers" or arbitrary strings with named constants.
- You can iterate through the constants of an enum type using the `values()` method.
- Enums can be defined inside or outside a [[Class]], but they cannot be defined inside a [[Method]].
### Syntax
#### Basic Declaration
`enum` **EnumName** {`ITEM`, `ITEM2`, `ITEM3`};
#### Usage in Code
>[!note]
>Once you have declared an enum, since it is a special "class", it becomes a DataType you can use. So you can create variables of that type, for example.

`EnumName` [Identifier] = `EnumName.ITEM`;
### Examples
```java
// Defining an Enum for Game States
public enum GameState {
    MENU,
    EXPLORING,
    COMBAT,
    EXIT
}

// Using an Enum in a Switch Statement
GameState currentState = GameState.MENU;

switch(currentState) {
    case MENU:
        System.out.println("Showing the main menu...");
        break;
    case EXPLORING:
        System.out.println("You wander into the darkness...");
        break;
    case COMBAT:
        System.out.println("A monster appears!");
        break;
    case EXIT:
        summarize();
        break;
}

// Iterating through all values of an Enum
for (GameState s : GameState.values()) {
  System.out.println(s);
}
```
