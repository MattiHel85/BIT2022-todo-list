console.log("connected");

const noteList = 'noteList'; 
const active = 'Active';
const completed = 'Completed';

/**THIS IS HOLDER OF PRIORITY SELECTION INITIALLY LOW*/ 
var selectedPriority = "Low";


//RESET SELECTED PRIORITY
//IT IS CALLED EVERYTIME MODAL IS OPENED
var resetPriority = function(){
    console.log("resetPriority")
    selectedPriority = "Low";
    console.log(selectedPriority)
    setTaskTitle()
}

//FUNCTION WHICH SAVES AN OBJECT INSIDE LOCAL STORAGE
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

//FUNCTION WHICH GETS AND OBJECT FROM LOCAL STORAGE
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

/**THESE ARE TWO HOLDERS RESPONSIBLE FOR KEEPING TRACK HOW TO FILTER NOTES*/
var isActiveTasksChecked = true; // BECAUSE INITIALLY THIS IS CHECKED
var isCompleteTasksChecked = false;

// item | description | date added | completed | delete
// FUNCTION RESPONSIBLE FOR DRAWING SINGLE NOTE ON THE SCREEN
var addNoteCard = function(title,description,date,status,priority,noteId,noteContainer){
    var changeStatusBtnText = "Complete"
    color = "white"
    if(status == completed){
        changeStatusBtnText = "Uncomplete";
        title = title.strike()
        color = "#c0c0c0"
        }
    var dotColor = getColor(priority)
    var singleNote = document.createElement('div');
    singleNote.id = noteId
    singleNote.className += 'note';
    singleNote.style.backgroundColor = color
    singleNote.innerHTML = `
        <h1>${title}</h1>
        <div class="p-1"></div>
        <div class="note-status d-flex flex-row justify-content-center">
            <h2>${status} task</h2>
            <div class="p-2"></div>
            <h2>${priority} priority</h2>
            <div class="note-circle" style="background-color: ${dotColor}"></div>
        </div>
        <div class="p-1"></div>
        <p class="desc">${description}</p>
        <p class="date">Task added: ${date}</p>
        <div class="d-flex  justify-content-center">
            <button  id="completeTaskCursor" class="btn btn-primary button"  onclick="switchTodoStatus(${noteId})">${changeStatusBtnText}</button>
            <button  id="deleteTaskCursor" class="btn btn-primary button" onclick="deleteTodo(${noteId})">Delete task</button>
        </div>
        `;
    noteContainer.appendChild(singleNote);
}

//RETURNS COLOR WHICH CORRESPONDS TO PRIORITY LEVEL
var getColor = function(priority){
    switch(priority){
        case "Low":
            return "green";
        case "Medium":
            return "yellow";
        case "High":
            return "red";
    }
}

//  FIRSTLY DELETE ALL NOTES THEN ADD ALL NOTES FROM LOCALSTORAGE
// IN THIS FUNCTION WE ALSO FILTER THE RESULT ACCORDING TO USER CHOICE.
var refreshNotesCards = function () {
    var numberOfColumns = getNumberOfColumns() // THIS CHECKS SCREEN SIZE AND ADJUST NUMBER OF COLUMNS
    currentNumberOfColumns = numberOfColumns // UPDATES NEW NUMBER OF COLUMNS
    clearTasksInfo() //CLEARING TASK INFO ON THE TOP OF THE SCREEN
    clearNoteCards()
    var listLocalStorage = localStorage.getObj(noteList) // GET OBJECTS FROM LOCAL STORAGE
    var filteredLocalStorage
    if(!isActiveTasksChecked && !isCompleteTasksChecked){ // IF NOTHING IS SELECTED RETURN AND DON'T SHOW ANYTHING
        return;
    }
    else if(isActiveTasksChecked & isCompleteTasksChecked){ // IF BOTH NOTES TYPES ARE SELECTED DO THIS
        filteredLocalStorage = listLocalStorage
        updateTasksInfo(listLocalStorage.filter(checkIfNotCompleted).length,active);
        updateTasksInfo(listLocalStorage.filter(checkIfNotActive).length,completed,true);
    }
    else if (!isActiveTasksChecked){ // IF ACTIVE TASKS ARE NOT SELECTED, FILTER ACTIVE TASKS OUT
        filteredLocalStorage = listLocalStorage.filter(checkIfNotActive)
        updateTasksInfo(filteredLocalStorage.length, completed)
    }
    else{ // OTHERWISE FILTER COMPLETED TASKS OUT
         filteredLocalStorage = listLocalStorage.filter(checkIfNotCompleted)
         updateTasksInfo(filteredLocalStorage.length, active)
     }
    var counter = 1 // KEEPING TRACK STARTS FROM FIRST NOTE CONTAINER
    for (eachNote in filteredLocalStorage){ // FOR EACH NOTE DRAW NEW NOTE ON THE SCREEN
        var correctNoteContainer = getCorrectNoteContainer(counter)
        var noteObject = filteredLocalStorage[eachNote];
        var noteIndex = listLocalStorage.indexOf(noteObject)
        addNoteCard(noteObject.title,
            noteObject.description,
            noteObject.date,
            noteObject.status,
            noteObject.priority,
            noteIndex,
            correctNoteContainer)
            if(counter == numberOfColumns) counter = 1; // IF COUNTER EQUALS NUMBER OF COLUMNS > RESTART COUNTER > SET IT TO 1
            else counter ++; // OTHERWISE ITERATE COUNTER
    }
}

// GET NUMBER OF COLUMNS ACCORDING TO THE SCREEN SIZE
var getNumberOfColumns = function(){
    if(window.innerWidth>=1400) return 4;
    if(window.innerWidth>=1200) return 3;
    if(window.innerWidth>=768) return 2;
    else return 1;
}

/**CHECKS STARTING NUMBER OF COLUMNS*/
var currentNumberOfColumns = getNumberOfColumns()

// EVERY TIME USER RESIZE WINDOW AND THE CURRENT NUMBER OF COLUMNS CHANGES REFRESH NOTES CARDS!
window.onresize = function(){
    var newNumberOfColumns = getNumberOfColumns()
    if(currentNumberOfColumns != newNumberOfColumns) {
        console.log("DIFFERENT NUMBERS OF COLUMNS, REFRESH NOTES!")
        refreshNotesCards()
    }
}


//THIS FUNCTION TAKES THE NUMBER WHICH IS A COUNTER IN WHICH COLUMN NOTE SHOULD BE ADDED
// RETURNS THE CORRECT NOTE CONTAINER
var getCorrectNoteContainer = function(counter){
    var noteContainer1 = document.getElementById("notes-1");
    var noteContainer2 = document.getElementById("notes-2");
    var noteContainer3 = document.getElementById("notes-3");
    var noteContainer4 = document.getElementById("notes-4");
    switch(counter){
        case 1:
            return noteContainer1;
        case 2:
            return noteContainer2;
        case 3:
            return noteContainer3;
        case 4:
            return noteContainer4;
    }
}

var clearNoteCards = function(){
    var noteContainer1 = document.getElementById("notes-1");
    var noteContainer2 = document.getElementById("notes-2");
    var noteContainer3 = document.getElementById("notes-3");
    var noteContainer4 = document.getElementById("notes-4");
    noteContainer1.innerHTML = "";
    noteContainer2.innerHTML = "";
    noteContainer3.innerHTML = "";
    noteContainer4.innerHTML = "";
}

//ADJUST THE INFORMATION ABOUT PRESENTED TASKS
var updateTasksInfo = function(size,status){
    var taskInfoContainer = document.getElementById("tasks-info");
    var tasks = "tasks";
    if(size == 0)return; // THERE'S NO TASKS SO DON'T SHOW INFORMATION
    if(size == 1)tasks = tasks.slice(0,-1); // THERE'S ONLY ONE TASK THEREFORE CUT 's' from "tasks"
    if(taskInfoContainer.innerHTML != ""){ // IF THERE'S SOME TEXT IN THE taskInfoContainer 
        taskInfoContainer.innerHTML += `
        and ${size} ${status.toLowerCase()} ${tasks} 
        `                                           // ADD NEW INFORMATION AS SECOND INFORMATION
    }
    else{ //OTHERWISE
    taskInfoContainer.innerHTML += `
    Showing ${size} ${status.toLowerCase()} ${tasks}
    ` // ADD AS FIRST INFORMATION
    }
}

//CLEARS CONTAINER WITH TASK INFO SO IT CAN BE ADJUSTED AGAIN
var clearTasksInfo = function(){
    var taskInfoContainer = document.getElementById("tasks-info");
    taskInfoContainer.innerHTML = "";
}

//CHECKS IF NOTE IS NOT ACTIVE
var checkIfNotActive = function(note){
    if(note.status == active) return false
    else return true
}

//CHECKS IF NOT IS NOT COMPLETED
var checkIfNotCompleted = function(note){
    if(note.status == completed) return false
    else return true
}

//ADDS NEW NOTE TO LOCAL STORAGE
//FIRSTLY CHECKS FOR INPUT VALIDITY IF INVALID SHOWS COOL ERROR ANIMATION AND RETURNS EARLY
var addNewNote = function () {
    var item = document.getElementById("item").value;
    var description = document.getElementById("description").value;
    var date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
    

    /**THIS CHECKS IF INPUT IS VALID AND REACTS FOR IT ACCORDINGLY
     * I WOULD LIKE TO HAVE THIS LOGIC AS SEPERATE FUNCTION BUT I DON'T KNOW HOW TO RETURN THIS FUNCTION EARLY WITH ANOTHER FUNCTION
    */
    if( item.length < 2 && description.length < 2){
        errorAnimation("item");
        errorAnimation("description");
        return;
    }
    if(item.length < 2){
        errorAnimation("item");
        return;
    }
    if(description.length < 2){
        errorAnimation("description");
        return;
    }

    //LOAD LIST OF NOTES FROM THE LOCAL SOTRAGE
    var oldListLocalStorage = localStorage.getObj(noteList)
    //CREATE NEW NOTE
    var newNote = new Note(item,description,date,selectedPriority,active) 
    //IF ARRAY OF NOTES FROM LOCAL STORAGE IS NULL CREATE NEW ARRAY
    //SAVE IT IN THE LOCAL STORAGE
    if(oldListLocalStorage == null) {
        var newArray = [newNote]
        localStorage.setObj(noteList,newArray)
    }
    //OTHERWISE ADD NEW NOTE TO OLD ARRAY 
    //SAVE NEW ARRAY IN LOCAL STORAGE
    else{
        oldListLocalStorage.push(newNote)
        localStorage.setObj(noteList,oldListLocalStorage)
    }
    //REFRESH NEW NOTES BECAUSE THE LOCALSTORAGE GOT UPDATED
    refreshNotesCards()
    clearInputFields()
}

// CLEAR ALL TASKS FROM LOCAL STORAGE.
var clearTasks = function(){
    localStorage.clear()
    refreshNotesCards()
}


//RESETS INPUT FIELDS
var clearInputFields = function(){
    document.getElementById("item").value = '';
    document.getElementById("description").value = '';
    //document.getElementById("task-priority").innerHTML = ''; 
}



// DELETES TODO NOTE FROM LOCALSTORAGE AND REFRESH NOTES ON THE SCREEN
var deleteTodo = function (id) {
    var listLocalStorage = localStorage.getObj(noteList)
    listLocalStorage.splice(id,1)
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}

// SWITCHES THE STATUS OF TODO NOTE FROM COMPLETE TO ACTIVE AND OTHERWISE
var switchTodoStatus = function(id){
    var listLocalStorage = localStorage.getObj(noteList)
    var oldNoteStatus = listLocalStorage[id].status
    if(oldNoteStatus === active){
        listLocalStorage[id].status = completed
        playSuccessSound()
    }
    else{
        listLocalStorage[id].status = active 
    }
    localStorage.setObj(noteList,listLocalStorage)
    refreshNotesCards()
}

//SHOWS THE ERROR ANIMATION BY ADDING BOUNCE CLASS TO FIELD AND THEN REMOVING IT AFTER 1000MS
var errorAnimation = function(elementId){
    document.getElementById(elementId).classList.add("bounce");
    setTimeout(function() {
      //remove the class so animation can occur as many times as user triggers event, delay must be longer than the animation duration and any delay.
      document.getElementById(elementId).classList.remove("bounce");
    }, 1000);   

}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
var openDropdown = function() {
    document.getElementById("myDropdown").classList.toggle("show");
  }


  // Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

//SELECTS PRIORITY IN ADDING NEW TODO NOTE WINDOW
  var prioritySelected = function(priority){
      selectedPriority = priority
      setTaskTitle()
  }
// ADJUST PRIORITY LEVEL ON TOP OF ADD NEW NOTE WINDOW
  var setTaskTitle = function(){
      var dotColor = getColor(selectedPriority)
      priorityLowCase = selectedPriority.charAt(0).toLowerCase() + selectedPriority.slice(1);
      document.getElementById("task-priority").innerHTML = `
      <div class="note-status d-flex flex-row justify-content-center">
        <div class="note-circle-modal" style="background-color: ${dotColor}"></div>
        <div class="p-1"></div>
        Add ${priorityLowCase} priority task
        <div class="p-1"></div>
        <div class="note-circle-modal" style="background-color: ${dotColor}"></div>
      </div>
      `
      
      ;
  }

  //WHENEVER PAGE GETS REFRESHED, REFRESH NOTES AND SET TASK TITLE
  var onLoad = function(){
      refreshNotesCards()
      setTaskTitle()
  }
//SWITCH THE FLAG BOOLEAN AND REFRESH NOTES
  var activeTasksToggle = function(boolean){
    var toggle = document.getElementById("active-toggle")
    if(boolean) toggle.innerHTML = "Hide current tasks"
    else toggle.innerHTML = "Show current tasks"
    isActiveTasksChecked = boolean;
    refreshNotesCards();
  }
//SWITCH THE FLAG BOOLEAN AND REFRESH NOTES
  var completedTasksToggle = function(boolean){
    var toggle = document.getElementById("completed-toggle")
    if(boolean) toggle.innerHTML = "Hide tasks history"
    else toggle.innerHTML = "Show tasks history"
    isCompleteTasksChecked = boolean;
    refreshNotesCards();
  }

  //PLAY SUCCESFUL "DING" SOUND
  var playSuccessSound = function(){
    var audio = new Audio('ding.wav');
    audio.play();
  }