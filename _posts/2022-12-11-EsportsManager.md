

---
title: "Esports Manager - made in C++"
date: 2022-12-11
---

So I am about to start creating a Sports (or Esports) Manager game.

My thoughts is to use C++. I was going to use C# as it seems to be more in-demand in the work-place.
The language too is far easy than C++ as memory allocation is automatic. But one issue that made me
choose C++ is performance. As I will be dealing with huge databases of players and managers, I will need
the best language for performance, thus C++.

# Tasks
[comment]: <> (&#9744; - unchecked | &#9745; - checked)

## &#9745; Create Person
- Name
- Age
- Nationality

## &#9745; Create Player
- Position

## &#9745; Create Manager

## &#9745; Create Team


## &#9744; Develop Attributes to Player and Manager

Out of 20

- Rating
- Morale
- Condition
- Map Play
- Scaling
- Combat
- Defense
- Objectives


## &#9744; Develop Attributes to Team

Out of 20

- Map Play
    - BEATS Combat and Objectives
    - DEFEATED BY Scaling and Defense
- Scaling
    - BEATS Defense and Map Play
    - DEFEATED BY Combat and Objective
- Combat
    - BEATS Objectives and Scaling
    - DEFEATED BY Map Play and Defense
- Defense
    - BEATS Map Play and Combat
    - DEFEATED BY Objectives and Scaling
- Objectives
    - BEATS Scaling and Defense
    - BEATS Map Play and Combat

&#9744; Create Match
- Early Game
- Mid Game
- Late Game
- Objectives



## &#9744; Create Match Calculations

### BEFORE MATCH

- Check if team has enough condition (50);

- Calculate match
    - Get raw rating
    - Calculate team speciality
        - Need team to choose a speciality
            - If team has more than one highest speciality
                - It must choose a random one.    
        - Need to type getters for team overall attributes rating
        - Calculate how much advantage

    - Calculate factor of morale
    - Calculate factor of condition 
    - 10% - (Raw Rating)
    - 70% - (Raw Rating) * (Percentage of Morale) * (Percentage of Condition) 
    - 20% - Speciality
        - If winning - gets
            - Total Advantage = (Winning Attribute - Losing Attribute);
            - If losing attribute is higher than winning attribute

- Print out
    - TEAMS
        - Each player's rating
        - Manager's rating
        - Overall rating
        - Team speciality
    - Likeiness of winning
        - Show raw rating
        - Playing Team Morale
        - Playing Team Condition
        - Any advantages/disadvantages in 

### During match

### After match
- ADD MORALE CLASS
- Change morale
    - If played, +5
    - If win, +5
        - If won for the second time, +15
        - If won for the third time or more, +20 
    - If lost, -10
        - If lost for the second time, -15
        - If lost for the third time or more, -20

- ADD CONDITION CLASS
- Change condition
    - If played, -75

## &#9744; Create Training

## &#9744; Create Tournament

