import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://we-are-the-champions-70e86-default-rtdb.firebaseio.com/'
}

const app = initializeApp(appSettings); // creates a Firebase App object
const database = getDatabase(app); // sets up a database variable
const endorsementsInDB = ref(database, 'endorsements'); // creates a reference to push data to

const form = document.querySelector('form');
const messageInput = document.getElementById('message');
const senderInput = document.getElementById('sender');
const recipientInput = document.getElementById('recipient');
const endorsementsContainer = document.querySelector('.endorsements-container');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const message = formData.get('message');
    const fromName = formData.get('from-name');
    const toName = formData.get('to-name');
    const endorsement = new Endorsement(message, fromName, toName);
    push(endorsementsInDB, endorsement);
    clearInputs();
})

document.addEventListener('click', function(e) {
    if (e.target.dataset.likes) {
        e.target.classList.toggle('red');
    }
})

onValue(endorsementsInDB, function(snapshot) {
    if (snapshot.exists()) {
        const endorsementsArray = Object.entries(snapshot.val());
        console.log(endorsementsArray);
        clearEndorsementsContainer();
        endorsementsArray.forEach((endorsement) => {
            appendToEndorsementsContainer(endorsement);
        })
    }
}) 

function Endorsement(message, fromName, toName) {
    this.message = message;
    this.fromName = fromName;
    this.toName = toName;
    this.likes = 0;
}

function clearInputs() {
    messageInput.value = '';
    senderInput.value = '';
    recipientInput.value = '';
}

function clearEndorsementsContainer() {
    endorsementsContainer.innerHTML = '';
}

function appendToEndorsementsContainer(endorsement) {
    const endorsementID = endorsement[0];
    const endorsementValue = endorsement[1];
    endorsementsContainer.innerHTML += `
                <div class="endorsement">
                    <p class="to">To: ${endorsementValue.toName}</p>
                    <p class="msg">${endorsementValue.message}</p>
                    <div class="last-line">
                        <p class="from">From: ${endorsementValue.fromName}</p>
                        <img src="images/heart.svg" class="like-icon" alt="heart icon" data-likes="${endorsementID}">
                    </div>
                    </div>
                </div>
            `;     
}
