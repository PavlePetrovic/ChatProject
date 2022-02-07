import Chatroom from "./chat.js";
import ChatUI from "./ui.js";

// DOM:
let ul = document.querySelector('#chat');
let sendBtn = document.querySelector('#sendBtn');
let userNameInp = document.querySelector('#userNameInp');
let userNameBtn = document.querySelector('#userNameBtn');
let navBar = document.querySelector('nav');
let chatPaper = document.querySelector('#chatPaper');
let colorInp = document.querySelector('#colorInp');
let colorBtn = document.querySelector('#colorBtn');
let timeBtn = document.querySelector('#timeBtn');
let startTime = document.querySelector('#startTime');
let endTime = document.querySelector('#endTime');
let navTab = document.querySelectorAll('.navTab');
let header = document.querySelector('header');
let icon = document.querySelector('#icon');
let form = document.querySelector('form');

let userName = localStorage.name;
if(localStorage.name){
    userName;
} else{
    userName = 'Anonymous';
}
let newRoom = localStorage.room;
if(localStorage.room){
    newRoom;
} else{
    newRoom = 'General';
}

// Objekti klasa / Instance klasa:
let chat = new Chatroom(newRoom, userName);
let chatUi = new ChatUI(ul);

chat.getChats((doc) => {
    chatUi.template(doc);
});

sendBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    // DOM:
    let msgInp = document.querySelector('#msgTxt');
    
    let sound = new Audio('./sound/success.mp3');
    sound.volume = 0.5;
    let message = msgInp.value;
    message = message.trim();
    if(message != ""){
        sound.play();
        chat.addChat(message)
        .then(() => {
            console.log('Uspesno si poslao poruku!');
        })
        .catch(err => console.log(err));
    } else{
        swal("Info", "Unesite tekst poruke", "info", {
            timer: 1000,
            button: false,
            className: "swal-modal",
            className: "swal-title",
            className: "swal-overlay",
            className: "swal-text",
        });
    }
    msgInp.value = null;
});

userNameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let newUserName = userNameInp.value;

    if(newUserName.length >= 2 && newUserName.length <= 10 ){
        chat.username = newUserName;
        localStorage.setItem('name', newUserName);
        swal("Accepted", `${newUserName}, uspesno si promenio username`, "success", {
            timer: 1500,
            button: false,
        });
        setTimeout(() => {
            location.reload();
        }, 1500);
    } else{
        swal("Warning", "Username mora imati izmedju 2-10 karaktera", "warning", {
            timer: 2000,
            button: "X",
            dangerMode: true
        });
    }
    userNameInp.value = null;
});

navTab.forEach(el => {
    let eli = el.children;
    el = Array.from(eli);
    el.forEach(a => {
        if(localStorage.room == a.id){
            a.parentNode.classList.add('active');
        }
    })
});

navBar.addEventListener('click', (e) =>{
    e.preventDefault()
    if(e.target.id){
        let rm = e.target;
        let ul = rm.parentNode.parentNode
        let ul1 = ul.children;
        ul = Array.from(ul1);
        ul.forEach(el => {
            el.classList.remove('active');
        })
        chatUi.clear();
        chat.roomUpdate(rm);
        chat.getChats(doc => {
            chatUi.template(doc);
        })
        newRoom = e.target.id;
        localStorage.setItem('room', newRoom);
    }
});

chatPaper.addEventListener('click', (e) => {
    e.preventDefault()
    if(e.target.tagName == 'I'){
        let user = e.target.parentNode.title;

        if(localStorage.name == user){
            swal({
                title: "Warning",
                text: "Da li sigurno zelis da obrises poruku?",
                icon: "warning",
                buttons: ['Ne', 'Da'],
                dangerMode: true,
              })
              .then((del) => {
                if (del) {
                    e.target.parentNode.remove();
                    chat.deleteMsg(e.target.parentNode.id);
                    swal("Uspesno si izbrisao poruku!", {
                        buttons: false,
                        icon: "success",
                        timer: 1500
                    });
                } else {
                    swal("Poruka nece biti izbrisana! :D", {
                        buttons: false,
                        timer: 1000
                    });
                }
              });
        } else{
            e.target.parentNode.remove();
        }
    }
});

colorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let colorValue = colorInp.value;
    setTimeout(() => {
        let ul2 = ul.children;
        Array.from(ul2).forEach(el => {
            el.style.background = `${colorValue}`;
        });
    }, 500);
    localStorage.setItem("color", colorValue);
});

timeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let second = new Date(endTime.value);
    let sSec = second.getTime() / 1000;
    let first = new Date(startTime.value);
    let fSec = first.getTime() / 1000;
    chatUi.clear();
    chat.getChats((d) => {
        let time = d.data().createdAt;
        if (time.seconds > fSec && time.seconds < sSec) {
            chatUi.template(d);
        }
    });
});

// For responsive design:
let mediaQuery = window.matchMedia('(max-width: 576px)');

navBar.addEventListener('click', (e) =>{
    e.preventDefault()
    if(e.target.tagName == 'A' && mediaQuery.matches){
        navBar.style.display = 'none';
        chatPaper.style.display = 'flex';
        icon.style.display = 'inline-block';
        form.style.display = 'block';
        header.classList.add('headerSm');
    }
});

icon.addEventListener('click', (e) => {
    e.preventDefault();
    navBar.style.display = 'flex';
    chatPaper.style.display = 'none';
    icon.style.display = 'none';
    form.style.display = 'none';
    header.classList.remove('headerSm');
})
