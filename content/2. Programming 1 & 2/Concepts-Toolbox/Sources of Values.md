---
aliases:
  - Value
  - Values
---
### 1. Literals
- Works on primitive [[Data Types.canvas|Data Types]], Strings, and wrappers.
- Integer Literals: `5`
- Float Literals: `3.14f`
- Double Literals: `3.14`
- Boolean Literals: `true` or `false`
- Character Literals: `'?'` or `'a'` or `'5'`
- String Literals: `"hello"` 
### 2. Variables of the same type
- Works on all [[Data Types.canvas|Data Types]].
```java
int x = y;
String s = otherString;
GRect brick = rect;
```

### 3. Methods that return the type
- Works on all [[Data Types.canvas|Data Types]].
```java
String s = getUserInput();
GRect brick = carveBlock(30,30);
int g = person.calculateRizz(x);
person.calculateRizz(getGame());
```

### 4. Expressions that result in the type
- Works on primitives, strings, and wrappers.
- *Note: Expressions can be made up of any combination of sources 1, 2, or 3.*
```java
// expression using literals
float f = 3.2f + 1.5f;

// expression using literals and other variables
int x = (y * 6) + 5;

// expression with strings
String s = "hello " + " fellow youths ";

// expression with method calls
String greeting = "Howdy there, " + player.getUsername();
```

### 5. New Instances of the type
- Works only on reference types.
```java
MnM red = new MnM();
GRect square = new GRect(50,50);
```