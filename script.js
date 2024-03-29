const categoriesContainer = document.getElementById("category-container");
const letterContainer = document.getElementById("letter-container");
const inputContainer = document.getElementById("input-container");
const ngContainer = document.getElementById("ng-container");
const ngButton = document.getElementById("ng-button");
const canvas = document.getElementById("game-canvas");
const resultText = document.getElementById("result-text");

//score
let correct = 0;
let strikes = 0;

let word = "";

//Show categories
function fetchCategories() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'hangman.php?action=fetchCategories', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            showCategories(data);
        } else {
            console.error('Error fetching categories');
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

// Function to display categories from fetched data
function showCategories(categories) {
    categoriesContainer.innerHTML += '<h3>Please Select A Category</h3>';
    let buttonContainer = document.createElement("div");
    for (let category in categories) {
        buttonContainer.innerHTML += `<button class="category" onclick="generateWord('${category}')">${category}</button>`;
    }
    categoriesContainer.appendChild(buttonContainer);  
}

//Generate word
function generateWord(categoryValue) {
    // Disable category buttons
    let categoryButtons = document.querySelectorAll(".category");
    categoryButtons.forEach((button) => {
        button.disabled = true;
    });

    // Update UI
    letterContainer.classList.remove("hide");
    inputContainer.innerText = "";

    // Make AJAX request to generate word
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'hangman.php?action=generateWord&category=' + categoryValue, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            if (data.word) {
                console.log('Generated word:', data.word);
                // Display dashes instead of letters
                let wordDisplay = data.word.replace(/./g, '<span class="dashes">_</span>');
                inputContainer.innerHTML = wordDisplay;
            } else {
                console.error('Error generating word:', data.error);
            }
        } else {
            console.error('Request failed');
        }
    };
    xhr.onerror = function() {
        console.error('Request failed');
    };
    xhr.send();
}

//Canvas
const canvasCreator = () => {
    let context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = "#000";
    context.lineWidth = 2;
  
    //For drawing lines
    const drawLine = (fromX, fromY, toX, toY) => {
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
    };
  
    const head = () => {
        context.beginPath();
        context.arc(70, 30, 10, 0, Math.PI * 2, true);
        context.stroke();
    };
  
    const body = () => {
        drawLine(70, 40, 70, 80);
    };
  
    const leftArm = () => {
        drawLine(70, 50, 50, 70);
    };
  
    const rightArm = () => {
        drawLine(70, 50, 90, 70);
    };
  
    const leftLeg = () => {
        drawLine(70, 80, 50, 110);
    };
  
    const rightLeg = () => {
        drawLine(70, 80, 90, 110);
    };
  
    //initial drawing (no man)
    const emptyDrawing = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        drawLine(10, 130, 130, 130);
        drawLine(10, 10, 10, 131);
        drawLine(10, 10, 70, 10);
        drawLine(70, 10, 70, 20);
    };
  
    return { emptyDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

  //draw the man
const drawMan = (strikes) => {
    let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
    switch (strikes) {
        case 1:
            head();
            break;
        case 2:
            body();
            break;
        case 3:
            leftArm();
            break;
        case 4:
            rightArm();
            break;
        case 5:
            leftLeg();
            break;
        case 6:
            rightLeg();
            break;
        default:
            break;
    }
};

const initialize = () => {
    correct = 0;
    strikes = 0;

    //clear the game
    inputContainer.innerHTML = "";
    categoriesContainer.innerHTML = "";
    letterContainer.classList.add("hide");
    ngContainer.classList.add("hide");
    letterContainer.innerHTML = "";

    //letter keyboard
    for (let i = 65; i < 91; i++) {
        let button = document.createElement("button");
        button.innerText = String.fromCharCode(i);
        button.addEventListener("click", () => {
            let charArray = word.split("");
            let dashes = document.getElementsByClassName("dashes");
            //if correct letter
            if (charArray.includes(button.innerText)) {
                charArray.forEach((char, index) => {
                    if (char === button.innerText) {
                        //replace dash with letter
                        dashes[index].innerText = char;
                        correct += 1;
                        //check if win
                        if (correct == charArray.length) {
                            resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${word}</span></p>`;
                            disableAll();
                        }
                    }
                });
            } else {
                //incorrect
                strikes += 1;
                drawMan(strikes);
                //if lost
                if (strikes == 6) {
                    resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2><p>The word was <span>${word}</span></p>`;
                    disableAll();
                }
            }

            button.disabled = true;
        });

        letterContainer.append(button);
    }

    fetchCategories();
    let { emptyDrawing } = canvasCreator();
    emptyDrawing();
};

const disableAll = () => {
    let categoryButtons = document.querySelectorAll(".options");
    let letterButtons = document.querySelectorAll(".letters");

    categoryButtons.forEach((button) => {
        button.disabled = true;
    });

    letterButtons.forEach((button) => {
        button.disabled = true;
    })

    ngContainer.classList.remove("hide");
};

//Start New Game
ngButton.addEventListener("click", initialize);
window.onload = initialize;