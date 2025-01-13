const modalCont = document.querySelector(".modal-cont");
const addButton = document.querySelector(".add-btn");
const taskArea = document.querySelector(".textArea-cont");
const darkButton = document.querySelector(".dark-mode");
const lightButton = document.querySelector(".light-mode");
const mainCont = document.querySelector(".main-cont");
const colors = document.querySelectorAll(".priority-color");
const trash = document.querySelector(".trash");
const download = document.querySelector(".download");
const filterBoxColors = document.querySelectorAll(".color")

let addButtonFlag = false;
let lightMode = true;
let taskColor = 'lightpink';
const priorityColor = ['lightpink', "lightgreen", "lightblue", "coral"];

let lockOpen = "fa-lock-open";
let lockClosed = "fa-lock";
let close = "fa-x";



// Getting saved tickets
let tickets = JSON.parse(localStorage.getItem('data'));
if (tickets) {
    tickets.forEach((ticket)=>{
        makeTicket(ticket.id, ticket.color, ticket.task);
    })
    console.log(tickets);
} else {
    console.log("No object found in localStorage.");
    tickets = [];
}

function write(){
    // localStorage.removeItem('data');
    localStorage.setItem('data', JSON.stringify(tickets));
    console.log(tickets);
}
function getTicketIndex(ID){
    ID = ID.substring(4,ID.length).trim();
    for(let i = 0; i<tickets.length; i++){
        if(tickets[i].id === ID) return i;
    }
}
function save(ticket){
    const ID = ticket.querySelector(".ticket-id").textContent;
    let idx = getTicketIndex(ID);
    tickets[idx].task = ticket.querySelector(".task-area").textContent;
    let color = ticket.querySelector(".ticket-color").style.backgroundColor;
    tickets[idx].color = color;
    write()
}


// Handle the removal of a ticket

function handleRemoval(ticket){
    const ticketLockContainer = ticket.querySelector(".ticket-lock");
    const icon = ticketLockContainer.children[0]
    icon.addEventListener('click',(e)=>{
        e.stopPropagation()
        let ID = ticket.querySelector(".ticket-id").textContent;
        let idx = getTicketIndex(ID);
        tickets.splice(idx,1);
        ticket.remove();
    });
}

// Handle the change of priority color of a ticket

function handleColor(ticket){
    const ticketColorBand = ticket.querySelector(".ticket-color");
    ticketColorBand.addEventListener("click", ()=>{
        currColor = ticketColorBand.style.backgroundColor;
        let idx = priorityColor.indexOf(currColor)+1;
        if(idx == 4) idx=0;
        ticketColorBand.style.backgroundColor = priorityColor[idx];
        // saving changes
        save(ticket);
    })
}

// Handle Lock to edit the task text

function handleLock(ticket){
    const ticketLockContainer = ticket.querySelector(".ticket-lock");
    const ticketLock = ticketLockContainer.children[0]
    const textArea = ticket.querySelector(".task-area");

    ticketLock.addEventListener("click", (e)=>{
        e.stopPropagation();
        if(ticketLock.classList.contains('fa-lock-open')){
            ticketLock.classList.remove(lockOpen)
            ticketLock.classList.add(lockClosed)
            textArea.setAttribute("contenteditable", "false")
            // saving the changes
            save(ticket);
        }else{
            ticketLock.classList.remove(lockClosed)
            ticketLock.classList.add(lockOpen)
            textArea.setAttribute("contenteditable", "true")
        }
        
    })
}

// handeling hover of tickets

function handelHover(ticket){
    ticket.addEventListener("mouseenter", ()=>{
        ticket.style.transform = 'scale(1.1)';
    })
    ticket.addEventListener("mouseleave", ()=>{
        ticket.style.transform = "scale(1)";
    })
}

// Modal popup open and Close

addButton.addEventListener("click", ()=>{
    if(addButtonFlag){
        modalCont.style.display = 'none';
        addButtonFlag = false;
    }else{
        modalCont.style.display = 'flex';
        addButtonFlag = true;
    }
})

// Get data from container and add it to main page

document.body.addEventListener("keydown", (e)=>{
    if(e.key=="F2" && addButtonFlag){
        const task = taskArea.value;
        const id = shortid();
        if (!task){
            alert("Task field cannot be empty");
            return
        }
        makeTicket(id,taskColor,task)
        taskArea.value = "";  
        // save data
        let ticket = {"task":task, "id":id, "color":taskColor};
        tickets.push(ticket);
        write();
        console.log(tickets);
        addButtonFlag = false;
        modalCont.style.display = "none";
    }
    if(e.key=="Escape"){
        addButtonFlag = false;
        modalCont.style.display = "none";
    }
})
function makeTicket(ticketId, ticketColor, ticketText){
    const cont = document.createElement("div");
    cont.className = "ticket-cont";
    cont.innerHTML = `<div class="ticket-color" style="background-color: ${ticketColor};">
                <div class="ticket-lock"> 
                    <i class="fa-solid fa-lock"></i>
                </div>
                
              </div>
             <div class="ticket-id">ID: ${ticketId}</div>
             <div class="task-area" contenteditable="false">${ticketText}</div>
              `
    mainCont.appendChild(cont);
    handleColor(cont);
    handleLock(cont);
    handelHover(cont);
}

// Selection of priority color
colors.forEach((item)=>{
    item.addEventListener('click', ()=>{
        colors.forEach((col)=>{
            col.classList.remove('active-color');
        })
        item.classList.add('active-color');
        taskColor = item.classList[0];
    })
})


// Deleting a ticket

let trashFlag = true;
trash.addEventListener("click", ()=>{
    const allTickets = document.querySelectorAll(".ticket-cont");
    if(trashFlag){
        trashFlag = false;
        allTickets.forEach((ticket)=>{
            let iconCont = ticket.querySelector(".ticket-lock")
            let icon = iconCont.children[0];
            icon.classList.remove(lockClosed);
            // icon.classList.remove(lockOpen);
            icon.classList.add(close);
            handleRemoval(ticket)
        })
    }else{
        trashFlag = true;
        allTickets.forEach((ticket)=>{
            let iconCont = ticket.querySelector(".ticket-lock")
            let icon = iconCont.children[0];
            icon.classList.remove(close);
            icon.classList.add(lockClosed);
        })
        write()
    }
})


// Filtering the tasks

filterBoxColors.forEach((color) => {
    const allTickets = document.querySelectorAll(".ticket-cont");
    color.addEventListener("click", () => {
        selectedColor = color.classList[0];
        if(selectedColor == "white"){
            allTickets.forEach((ticket)=>{
                
                ticket.style.display = "block";
            })
            return;
        }
        allTickets.forEach((ticket)=>{
            let tickColor = ticket.querySelector(".ticket-color").style.backgroundColor;
            if (tickColor == selectedColor){
                ticket.style.display = "block"
            }else{
                ticket.style.display = "none"
            }
        })
    })
})


// Downloading data

download.addEventListener("click", ()=>{
    const jsonData = localStorage.getItem('data');
    if (!jsonData) {
        alert("No data found in localStorage!");
        return;
    }
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kanban_Board_Data.json'; // Replace with your desired file name
    document.body.appendChild(a);
    a.click();

    // Clean up the DOM and revoke the object URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
})



// Dark mode light mode
lightButton.addEventListener("click", ()=>{
    if(!lightMode){
        lightButton.style.display = 'none';
        darkButton.style.display = 'block';
        lightMode = true;
    }
    const allTickets = document.querySelectorAll(".ticket-cont");
    document.querySelector("body").style.backgroundColor = "white"
    allTickets.forEach((ticket) => {
        ticket.style.boxShadow = "10px 10px 5px black"
    })
})

darkButton.addEventListener("click", ()=>{
    if(lightMode){
        lightButton.style.display = 'block';
        darkButton.style.display = 'none';
        lightMode = false;
    }
    const allTickets = document.querySelectorAll(".ticket-cont");
    document.querySelector("body").style.backgroundColor = "black"
    allTickets.forEach((ticket) => {
        ticket.style.boxShadow = "10px 10px 5px rgb(104, 106, 89)"
    })
})

