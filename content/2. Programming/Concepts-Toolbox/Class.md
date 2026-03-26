---
aliases:
  - Classes
tags:
  - concept
---
## Notes and Info
- A **Class** is a blueprint or template used to create [[Object|Objects]].
- It defines the **state** (data) and **behavior** (actions) that the resulting objects will have.
- Think of a class as a "cookie cutter" and the objects as the "cookies."
- In Java, every line of code must exist inside a class.
- A class typically consists of:
    - **[[Variable|Instance Variables]] (Fields):** The data the object holds.
    - **[[Constructor|Constructors]]:** Special methods used to [[Initialization|Initialize]] new objects.
    - **[[Method|Methods]]:** The functions that define what the object can do.
- Classes can also include things like:
	- **Class Constants**: Data shared by all instances of a class (Like [[Variable|Variables]] but marked marked [[Modifier#^5e8c8e|Static]] and [[Modifier#^1d2b42|Final]])
	- [[Enumeration|Enumerations]]: Custom data types defined within the class to represent specific states (e.g., `RoomStatus`).
	- **Static Methods**: Things a class can do without being [[Instantiation|Instantiated]] first. 
	- **Initialization Blocks**: Allow you to run logic for initializing variables when a class is first loaded. These come in both Static and Instance varieties.
	- **Nested Classes** (Inner Classes): You can actually define a class within a class. This is done when the inner class is only used by the outer class.
### Syntax
#### Basic Class
`public` `class` **ClassName** { 
	// Instance Variables
	// Constructor
	// Methods (behaviors)	
}

#### Full Class, Properly Ordered
`public class` **ClassName** {
	// Class Constants
	// Enums
	// Static initialization blocks
	// Static Methods
	// Instance Variables
	// Instance Initialization Blocks
	// Constructors
	// Instance Methods
}
### Examples
#### An Ordinary Class
```java
public class NormalClass {
	// Instance Variable
	private String name;
	
	// Constructor
	public NormalClass {
	
	}
	
	// Method
	private void someMethod(){
	
	}
}
```

#### A Class With Everything
```java
public class MasterTemplate {

    // 1. CLASS CONSTANTS (static final)
    // Always at the top so we know the fixed rules of the class.
    public static final String GAME_NAME = "Dungeon Crawler";

    // 2. ENUMS
    // Custom types used by the class members below.
    public enum Difficulty { EASY, HARD }

    // 3. STATIC INITIALIZATION BLOCKS
    // Runs ONCE when the class is loaded, before any objects exist.
    static {
        System.out.println(GAME_NAME + " logic is loading into memory...");
    }

    // 4. STATIC METHODS
    // Utilities that belong to the class, not a specific object.
    public static int calculateLevel(int xp) {
        return xp / 100;
    }

    // 5. INSTANCE VARIABLES (Fields)
    // The "State" - what each object will remember.
    private int score;
    private String playerName;

    // 6. INSTANCE INITIALIZATION BLOCKS
    // Runs every time 'new' is called, right before the constructor.
    // Useful for shared setup logic across multiple constructors.
    {
        this.score = 0; 
        System.out.println("Preparing new player data...");
    }

    // 7. CONSTRUCTORS
    // The final step of object creation.
    public MasterTemplate(String name) {
        this.playerName = name;
        System.out.println("Welcome, " + name);
    }

    // 8. INSTANCE METHODS
    // The "Behavior" - what the objects can actually do.
    public void addPoints(int p) {
        this.score += p;
    }

    // 9. NESTED CLASSES
    // Helper classes hidden inside the main blueprint.
    private class InternalHelper {
        // Logic only visible to MasterTemplate
    }
}
```
