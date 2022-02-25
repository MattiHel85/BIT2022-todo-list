# BIT2022 Taskmaster 2.0
## githubpages URL https://mattihel85.github.io/BIT2022-todo-list/

Pair work: Matthew Simpson & Michał Guspiel

Taskmaster 2.0 is a simple ToDo web application. We wanted to design something slightly more interesting than a small too simple window with a list of tasks one under another. After sketching some wireframes we decided to take an inspiration from padlet.org.

Therefore our ToDo application is based  on large tasks note cards which user can add, mark as complete, delete and filter. Each task note is made of priority level, title and description.

Filtering is possible thanks to task status and two toggle buttons, user can configure toggle buttons to see one of 4 options: 
- Seeing active tasks
- Seeing completed tasks
- Seeing both types of tasks
- Seeing nothing

In order to keep consistent layout of the notes we have 4 columns with cards to which notes are appended with JavaScript code. With refreshNotesCards function app refreshes cards everytime it's required. The function keeps track to which column next note should be added as well as evaluates how many columns are there according to current screen width. 

## Application screenshots

<p align="center">
 <img src="https://user-images.githubusercontent.com/70368829/155522502-63d21a7b-31ed-42ff-acca-7b072a95e0ba.png" width="700">
   <img src="https://user-images.githubusercontent.com/70368829/155522505-8a9f61fe-f4f1-45e3-b5f6-7ab34c1e1bbf.png" width="700">
 <img src="https://user-images.githubusercontent.com/70368829/155522508-6eb0d9e6-89de-480d-a420-3b2074a5e5cd.png" width="700">
  <img src="https://user-images.githubusercontent.com/70368829/155522511-9e4dfab2-6afe-4edc-91f6-ba36c46aa7ee.png" width="700">
</p>

## Features implemented
- Adding note
- Deleting note
- Marking note as complete
- Clearing all notes
- Filtering notes based on status

## Additional features that could be implemented:
- List of tasks. It would be nice to have many different lists of the task and make a feature in which user could choose which list is currentyl displayed and edited.
- Connecting app with a server instead of storing data on localstorage
- Edting note
