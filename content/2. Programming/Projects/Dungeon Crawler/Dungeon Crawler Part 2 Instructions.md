## Overview

This is the "Controller/View" hybrid class where the game logic finally comes together. You will manage user input, navigate the rooms, and handle combat.
## Project Class: DungeonCrawler

### Constants
- [ ] [[Declaration Statement|Declare]] a constant `String` for `normalOptions`.
- [ ] [[Declaration Statement|Declare]] a constant `String` for `combatOptions`.
- [ ] [[Initialization|Initialize]] your option Strings with the following:

```java
String normalOptions = "What do you do?\n" +
        "1. Continue\n" +
        "2. Explore the room\n" +
        "3. Leave Dungeon\n";

String combatOptions = "What do you do?\n" +
        "1. Run to the next room!\n" +
        "2. Fight back!\n" +
        "3. Run out of the dungeon!\n";
```
### Instance Variables
- [ ] [[Declaration Statement|Declare]] a `List` of `Treasure` to store collected items. You can use `ArrayList` or `LinkedList`.
- [ ] [[Declaration Statement|Declare]] a `Scanner` named `scr`
>[!hint]-
>You will need to import `java.util.Scanner`
- [ ] [[Declaration Statement|Declare]] a `String` for `input` to store user responses.
### Constructor
- [ ] [[Initialization|Initialize]] the **treasure list**
- [ ] [[Initialization|Initialize]] **scr**, and pass in `System.in` as an argument for what to scan.
>[!hint]-
> The `Scanner` class constructor has a parameter for an input stream. In this case we are going to give it `System.in`, as follows:
> `scr = new Scanner(System.in);` 

- [ ] [[Initialization|Initialize]] the **input string** to a blank String - `""`
---
### Behaviors

#### Playing the Game
- [ ] Write a [[Method]] called **play**
- [ ] Print a startup message to the console. Here is the one I did:
```java
System.out.println(  
        "\nYou wake up one morning and decide to go dungeon delving.\n" +  
                "You arrive at the entrance to a dungeon, the location of which was given to you by a shady individual in a tavern.\n" +  
                "He claimed that the dungeon was ever changing, and never provided the same experience twice. \n" +  
                "He also claimed that the dungeon was full of treasure... so you enter.\n"  
);  
  
// The \n stands for "new line" and just causes a line // break.
```

- [ ] [[Instantiation|Instantiate]] a `Dungeon` (suggested: 10 rooms).
- [ ] **Optimization:** Cache the list of rooms from the dungeon into a local variable.
>[!hint]-
>Caching data in this case just means to prevent repeatedly calling a method by calling the method once and storing the results in a variable instead.
>`List<Room> rooms = dungeon.getRooms();`
>Now instead of having to say `dungeon.getRooms()` all the time, you can just say `rooms`.  

- [ ] Create a [[For Loop]] that runs once for each room in the dungeon.
    - [ ] [[Declaration Statement|Declare]] a local `Room` [[Variable]] and [[Initialization|Initialize]] it with the current room.
    - [ ] Print the current room.
>[!hint]-
>Because we implemented the `toString()` method of `Room` back in [[Dungeon Crawler Part 1 Instructions#^5366ab|Dungeon Crawler Part 1]], if we just do `System.out.println(currentRoom);` (or whatever you called the temp variable in the previous step), Java will assume we meant `System.out.println(currentRoom.toString());`.

- [ ] Print the `normalOptions`.
- [ ] Call `getNormalInput(room)`.
- [ ] After the loop finishes, call `summarize()`.
#### Getting Non-Combat Input
- [ ] Write a [[Method]] called **getNormalInput** that takes a `Room` as a [[Parameter]].
- [ ] [[Assignment Statement|Assign]] the `input` to `scr.nextLine()`.
- [ ] Use a [[Switch]] statement on the `input`:
    - [ ] **Case 1:** Do nothing (proceeds to next room).
    - [ ] **Case 2:** Call `exploreRoom(room)`.
    - [ ] **Case 3:** Print a "gave up" message and call `summarize()`
    - [ ] **Default:** Print "Invalid Input" and call `getNormalInput(room)` (recursion).
- [ ] Print a message stating the player is moving to the next room.
    

#### Getting Combat Input
- [ ] Write a [[Method]] called **getCombatInput()**
- [ ] Set the `input` variable using `scr.nextLine()`.
- [ ] Use a [[Switch]] on the `input`:
    - [ ] **Case "1":** Print a message about escaping. Remove a random `Treasure` from `collectedTreasures`.
    - [ ] **Case "2":** Print the result of the `fightMonster()` method.
    - [ ] **Case "3":** Call `summarize()`.
    - [ ] **Default:** Call `getCombatInput()` again.

#### Exploring Rooms
- [ ] Write a [[Method]] called **exploreRoom** that takes a `Room` as a parameter.
- [ ] Print the result of `room.explore()`.
- [ ] [[If Statement|If]] the room has a monster:
    - [ ] Print `combatOptions`.
    - [ ] Call `getCombatInput()`.
- [ ] Use `.addAll()` to move all treasures from the room into `collectedTreasures`.

#### Fighting Monsters
- [ ] Write a [[Method]] that [[Return Statement|Returns]] a `String` called **fightMonster**
	- [ ] Use `Math.random()` to determine the outcome (Suggested: > .3 for a 70% win rate).
- [ ] [[Return Statement|Return]] a success message if the player wins.
- [ ] If the player loses:
    - [ ] Remove a random `Treasure` from `collectedTreasures`.
    - [ ] [[Return Statement|Return]] a message explaining the loss and identifying which item was dropped.

#### Summarizing
- [ ] Write a [[Method]] called **summarize**
- [ ] Calculate the total `value` of all treasures in `collectedTreasures`.

> [!hint]- Use a [[For Loop]] or a "For-Each" loop to iterate through the list and add the values to a running total.

- [ ] Print the final list of treasures and the total gold value.
- [ ] Call `System.exit(0)` to end the program.