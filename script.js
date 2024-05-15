let timer; // Variable to hold setInterval() function

let minutes = 0;
let seconds = 0;
let milliseconds = 0;

let times = []; // Array to store recorded times

function startStop() {
  if (!timer) {
    timer = setInterval(runStopwatch, 10); // Update every 10 milliseconds
    document.getElementById("startStop").textContent = "Stop";
  } else {
    clearInterval(timer);
    timer = null;
    document.getElementById("startStop").textContent = "Start";
  }
}

function runStopwatch() {
  milliseconds++;
  if (milliseconds === 100) {
    milliseconds = 0;
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
  }
  let display = `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
  document.getElementById("stopwatch").textContent = display;
}

function reset() {
  clearInterval(timer);
  timer = null;
  minutes = 0;
  seconds = 0;
  milliseconds = 0;
  document.getElementById("startStop").textContent = "Start";
  document.getElementById("stopwatch").textContent = "00:00:00";
  
  // Refresh the scramble
  displayScramble();
}

function recordTime() {
  times.push(`${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`);
  displayTimes();
  calculateStatistics();
}

function displayTimes() {
  let timesList = document.getElementById("times");
  timesList.innerHTML = "";
  times.forEach((time, index) => { // Add index parameter to forEach
    let li = document.createElement("li");
    li.textContent = time;
    
    // Create a button to remove this time
    let removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = function() {
      removeTime(index); // Call removeTime function with the index of the time
    };

    // Append the remove button to the list item
    li.appendChild(removeButton);
    
    timesList.appendChild(li);
  });
}

function removeTime(index) {
  times.splice(index, 1); // Remove the time at the specified index
  displayTimes(); // Refresh the displayed times
  calculateStatistics(); // Recalculate statistics
}
function calculateStatistics() {
  let bestTime = times.length > 0 ? times.reduce((a, b) => (a < b ? a : b)) : "-";
  let worstTime = times.length > 0 ? times.reduce((a, b) => (a > b ? a : b)) : "-";
  
  document.getElementById("bestTime").textContent = bestTime;
  document.getElementById("worstTime").textContent = worstTime;

  // Calculate Average of 5 (AO5)
  let ao5 = "-";
  let bestAo5 = "-";
  if (times.length >= 5) {
    let lastFiveTimes = times.slice(-5);
    ao5 = calculateAverage(lastFiveTimes);
    bestAo5 = lastFiveTimes.reduce((a, b) => (a < b ? a : b));
  }
  document.getElementById("ao5").textContent = ao5;
  document.getElementById("bestAo5").textContent = bestAo5;

  // Calculate Average of 12 (AO12)
  let ao12 = "-";
  let bestAo12 = "-";
  if (times.length >= 12) {
    let lastTwelveTimes = times.slice(-12);
    ao12 = calculateAverage(lastTwelveTimes);
    bestAo12 = lastTwelveTimes.reduce((a, b) => (a < b ? a : b));
  }
  document.getElementById("ao12").textContent = ao12;
  document.getElementById("bestAo12").textContent = bestAo12;
}

function calculateAverage(timesArray) {
  let sum = timesArray.reduce((acc, time) => acc + timeToMilliseconds(time), 0);
  return millisecondsToTime(sum / timesArray.length);
}
function calculateAverageOfFive(timesArray) {
  if (timesArray.length < 5) {
    return "-";
  }

  // Sort the times in ascending order
  let sortedTimes = timesArray.slice().sort();

  // Remove the best and worst times
  sortedTimes.shift(); // Remove the best time
  sortedTimes.pop();   // Remove the worst time

  // Calculate the sum of the remaining three times
  let sum = sortedTimes.reduce((acc, time) => acc + timeToMilliseconds(time), 0);

  // Calculate the average of the remaining three times
  return millisecondsToTime(sum / 3);
}

function timeToMilliseconds(time) {
  let parts = time.split(":");
  return parseInt(parts[0]) * 60000 + parseInt(parts[1]) * 1000 + parseInt(parts[2]);
}

function millisecondsToTime(milliseconds) {
  let mins = Math.floor(milliseconds / 60000);
  milliseconds -= mins * 60000;
  let secs = Math.floor(milliseconds / 1000);
  milliseconds -= secs * 1000;

  // Truncate milliseconds to three digits
  let truncatedMilliseconds = Math.floor(milliseconds / 10);

  return `${pad(mins)}:${pad(secs)}:${pad(truncatedMilliseconds)}`;
}


function clearRecords() {
  times = [];
  displayTimes();
  calculateStatistics();
}

function pad(value) {
  return value < 10 ? `0${value}` : value;
}

// Define an array of possible moves for the Rubik's Cube
const moves = ["U", "U'", "U2", "R", "R'", "R2", "L", "L'", "L2", "F", "F'", "F2", "B", "B'", "B2"];

// Function to generate a random scramble algorithm
function generateScramble() {
  let scramble = "";
  let lastMove = ""; // Keep track of the last move

  for (let i = 0; i < 20; i++) { // Generate 20 random moves
    let randomMove;
    do {
      randomMove = moves[Math.floor(Math.random() * moves.length)];
      console.log("while",randomMove,lastMove);
    } while (randomMove === lastMove || isInverse(lastMove, randomMove)); // Regenerate if the move is the same as the last one or its inverse

    scramble += randomMove + " ";
    lastMove = randomMove;
  }
  
  return scramble.trim(); // Remove trailing space
}


// Function to check if two moves are inverses of each other
function isInverse(move1, move2) {
  // Define the inverse moves for each move
const x=move1[0];
const a=[x,x+"2",x+"'"];
  // Check if move2 is the inverse of move1
  return a.includes(move2);
}


// Function to display the scramble
function displayScramble() {
  let scrambleText = document.getElementById("scrambleText");
  scrambleText.textContent = generateScramble();
}

// Call displayScramble function to show the initial scramble when the page loads
displayScramble();

// Function to save times to localStorage
function saveTimes() {
  localStorage.setItem("times", JSON.stringify(times));
}

// Function to load times from localStorage
function loadTimes() {
  let storedTimes = localStorage.getItem("times");
  if (storedTimes) {
    times = JSON.parse(storedTimes);
    displayTimes();
    calculateStatistics();
  }
}

// Call loadTimes function to load times when the page loads
loadTimes();

// Event listener to save times when the page is unloaded
window.addEventListener("beforeunload", saveTimes);
