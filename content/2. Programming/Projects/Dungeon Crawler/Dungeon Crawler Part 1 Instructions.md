## Read Me First
- I have added some neat features to these instructions. 
- For example, I have directly linked our notes so you won't have to go looking. 
- Remember that you can not only click on a link to go to the full note, but hovering a link will activate a pop-up. In some cases, I have linked to specific parts of notes to make this faster for you. Try it here: [[Variable#^9b9956|Declare a Variable]].
- I have also added spoilers, which look like blank lines in the text: <span class="cloze-span">made you look</span>. This lets me add hints for things like what [[Data Types.canvas|Data Type]] to use if you get stuck, without totally taking the challenge out for those of you who feel like you understand it. To clear a spoiler/cover it, just click on it. 
- Try it here: <span class="cloze-span">👌gotcha hahaha</span>
## Overview
One of the earliest types of video games was the **text adventure**.

**Famous examples include:**

- Zork
- The Oregon Trail

In this project, you will build your own **text-based dungeon crawler**.

**Goals:**

- Randomly generated
- Easy to expand
- Creative and customizable

You should be able to test your friends with the dungeon you create!
## Project Spec
**Each dungeon will be:**

- Randomly generated
- Linear (rooms in a straight sequence) ⭐
- Made up of rooms that contain one of the following:
    - Treasure
    - A monster
    - Nothing
### Project Classes
- Main
- Treasure (model)
- Room (model)
- Dungeon (model)
- DungeonGenerator (controller)
- DungeonCrawler (view)
## Using Random Numbers

- This project frequently uses `Math.Random()`.
- Most of the time, you will cast the result to an `int`.
	- To cast, simply put the data type you wish to **convert to** in front of the data you want to **convert from**. ^0f3bb1
	- For example: `(int)Math.Random()`
### Basic Pattern
- When choosing randomly from a number of possibilities:
	- Multiply `Math.random()` by the number of possibilities.
	- [[Dungeon Crawler Part 1 Instructions#^0f3bb1|Cast]] the result to an `int`.
### Adding a Minimum Value ("Floor")
- Sometimes you do not want **0** to be a possible result.
- In that case, add your minimum number to the [[Dungeon Crawler Part 1 Instructions#^0f3bb1|Cast]] result.
- The number you add is called the **floor**, but you can think of it as the minimum.
- In this project, you will often use this when generating treasure values. (You don't want treasures worth 0)
- The syntax looks like this: 
```java
(int)(Math.Random() * max) + floor;
```

## Building the Classes
### Treasure
#### [[Modifier#^2c2980|Class Constant]] (static final)
- [ ] [[Declaration Statement|Declare]] a `List` of `String` for Treasure Descriptions.
	-  (Yes, I do mean `List` not `ArrayList` or `LinkedList`)
	- The next instruction only works with plain `List`. 
- [ ] On the same line, [[Initialization|Initialize]] the list using `List.of()`
	- `List.of()` is sort of like initializing an [[Array#^926427|Array]] with default values.
	- Example: `List.of("desc 1", "desc 2", "desc 3")`
- [ ] Have a **minimum** of 3 treasure descriptions.

> [!note] 
> This (and the other Class Constants in this project) are a *source* of descriptions, but they are shared among *all* Treasures. Each *instance* of Treasure needs to have its own description.
> 

#### Instance Variables
- [ ] [[Declaration Statement|Declare]] a [[Variable]] for the **description** of the Treasure.
	- use `||String||`
- [ ] [[Declaration Statement|Declare]] an [[Variable]] for the **value** of the Treasure.
	- use `||int||`
#### Constructor
- [ ] [[Initialization|Initialize]] the **description** to a random one from the **Class Constant** list.
- [ ] [[Initialization|Initialize]] the **value** to a random number.
#### Behaviors
- [ ] Make an **accessor** for **value**.
- [ ] [[Method Overriding|Override]] `toString()` so that it:
	- [[Return Statement|Returns]] a treasure's **description** and **value**.
	- Example format: `A glittering gemstone, worth 50 gold pieces.`
	- Combo: `description + " worth " + value + " gold pieces."`
### Room
#### [[Modifier#^2c2980|Class Constant]] (static final)
- [ ] [[Declaration Statement|Declare]] a `List` of `String` for Room Descriptions.
- [ ] On the same line, [[Initialization|Initialize]] the list using `List.of()`
	- `List.of()` is sort of like initializing an [[Array#^926427|Array]] with default values.
	- Example: `List.of("desc 1", "desc 2", "desc 3")`
- [ ] Have a **minimum** of 3 descriptions.
#### Instance Variables
- [ ] [[Declaration Statement|Declare]] a [[Variable]] for the **description** of the Room.
	- use `||String||` 
- [ ] [[Declaration Statement|Declare]] a [[Variable]] for the list of **treasures** in the Room. 
	-  use `||ArrayList or LinkedList||` 
- [ ] [[Declaration Statement|Declare]] a [[Variable]] for if the room has a monster or not.
	- use `||String||`
#### Constructor
- [ ] [[Initialization|Initialize]] the **description** with a random description from the **Class Constant** List.
- [ ] [[Initialization|Initialize]] the **has monster** variable. 
	- This should be a random chance. Try giving a monster a 1 in 4 (25%) chance of appearing.
	- To prove you understand [[Boolean Expression|Boolean Expressions]], try doing this *without* an [[If Statement]].
	- Hint 1: ||you don't need to cast Math.Random() here, or use a maximum OR a minimum.||
	- Hint 2: `||hasMonster = Math.Random() > .75||`
- [ ] [[Initialization|Initialize]] the **treasure list**.
- [ ] [[If Statement|If]] the room *does not* have a monster, add a random number of treasures (0-3) to the **treasure list**. 
	- use ||a for loop that runs for a random number of times||
#### Behaviors
