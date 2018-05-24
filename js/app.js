/* Summary
- In addition to the expected functionality of the game, I've added:
  * You have to insert a nickname before you can start.
  * The player's name is displayed below the board during the game. (It also changes depending on your competitor - player 2 or computer)
  * You can choose if you want to play agains another human (player 2) or the computer. The computer chooses a random box for each turn.
  * The winners name is displayed if there is a winner.
*/

!function(){ // Modular pattern
  let player1Array = [];
  let player2Array = [];
  let currentPlayer = "player1";
  let allBoxes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let possibleBoxes = [];
  const nameField = document.getElementById("nameInput");

  // Page load
  $(boardScreen).hide() // Hiding content
  $(finishScreen).hide() // Hiding winner screen

  // Start Game
  $(startButton).click(function() {
    if(nameField.value === ""){
      nameField.style.borderColor = "red";
    } else {
      $(startScreen).fadeOut(500);
      $(boardScreen).fadeIn(500);
      $(player1).addClass("active");

      // Toggle - play agains computer or player 2?
      if (document.getElementById("toggle").checked) {
        $(playerName).html(nameField.value + " vs. The Computer")
      } else {
        $(playerName).html(nameField.value + " vs. Player 2")
      }
    }
  });

  // Making sure the name field is filled out
  nameField.addEventListener("keyup", () =>{
    if (nameField.value === ""){
      nameField.style.borderColor = "red";
    } else {
      nameField.style.borderColor = "white";
    }
  });

  // Change current player
  function changePlayer(activePlayer, nextPlayer, newPlayer){
    $(activePlayer).removeClass("active");
    $(nextPlayer).addClass("active");
    currentPlayer = newPlayer;
  }

  // Hover background
  $(boxes).children().mouseover(function() {
    if ($(player1).hasClass("active") && this.className !== "box box-filled-1"){
      this.style.backgroundImage = "url('img/o.svg')";
    } else if ($(player2).hasClass("active") && this.className !== "box box-filled-2"){
      this.style.backgroundImage = "url('img/x.svg')";
    } else {
      // <----- Do nothing
    }
    // Remove hover background on mouseout
  }).mouseout(function() {
    if (this.className === "box box-filled-1" || this.className === "box box-filled-2"){
      // ----> Nothing happens if the box is already marked
    } else {
      this.style.backgroundImage = "none";
    }
  });

  // Click and mark boxes
  $(boxes).children().click(function() {
    if ($(player1).hasClass("active")){
      this.className = "box box-filled-1";
      this.style.backgroundImage = "url('img/o.svg')";
      player1Array.push(($(boxes).children().index(this)));
      winner();
      changePlayer(player1, player2, "player2");

      if (document.getElementById("toggle").checked) {
        computer();
      }
    } else {
      this.className = "box box-filled-2";
      this.style.backgroundImage = "url('img/x.svg')";
      player2Array.push(($(boxes).children().index(this)));
      winner();
      changePlayer(player2, player1, "player1");
    }
  });

  // Winning combinations
  const winnerArray = [
    [0, 1, 2],
    [0, 4, 8],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6]
    ];

  // Testing if the players have a winning combination
  function winner(){

    // Testing one array at the time
    for (let u = 0; u < winnerArray.length; u += 1){
      array = winnerArray[u];
      let count = 0

      // Testing all marked boxes from the player1
      if(currentPlayer === "player1"){
        for (let i = 0; i < player1Array.length; i += 1){
          if(array.indexOf(player1Array[i]) > -1){
            count += 1;
          }
          if(count === 3){
            theWinner("player1");
          }
        }

      // Testing all marked boxes from the player2/computer
      } else {
        for (let i = 0; i < player2Array.length; i += 1){
          if(array.indexOf(player2Array[i]) > -1){
            count += 1;
          }
          if(count === 3){
            theWinner("player2");
          }
        }
      }
    }
    let screenFinish = document.getElementById("finishScreen")

    if(player1Array.length > 4 && possibleBoxes.length <= 2){

      // In case you win on the last box
      if(screenFinish.classList.contains("screen-win-one") || screenFinish.classList.contains("screen-win-two")) {
        // <----- Do nothing.
      } else {
        $(message).text("It's a tie..");
        $(finishScreen).addClass("screen-win-tie");
        $(finishScreen).show();
      }
    }
  }

  // Prepare and show winner screen
  function theWinner(winner){
    if (winner === "player1"){
      $(finishScreen).addClass("screen-win-one");
      $(message).html(document.getElementById("nameInput").value + ", you won!");
    } else {
      $(finishScreen).addClass("screen-win-two");

      // Changing text if it is computer or player2
      if (document.getElementById("toggle").checked) {
        $(message).text("The Computer wins!");
      } else {
        $(message).text("Player 2 wins!");
      }
    }
    $(finishScreen).show();
  }

  // Resetting everything for a new game
  $(newGameButton).click(function() {
    $(finishScreen).hide();
    $(boardScreen).show();
    $(player1).removeClass("active");
    $(player2).removeClass("active");
    $(player1).addClass("active");
    $(finishScreen).removeClass("screen-win-one");
    $(finishScreen).removeClass("screen-win-two");
    $(finishScreen).removeClass("screen-win-tie");
    player1Array = [];
    player2Array = [];

    // Unmark all boxes
    for (let i = 0; i < $(boxes).children().length; i += 1){
      $(boxes).children()[i].className = "box"
      $(boxes).children()[i].style.backgroundImage = "";
    }
  });

  // Computer logic
  function computer(){
    possibleBoxes = []; // Resetting the array

    // Filter out unmarked boxes and add them to possibleBoxes
    for (let i = 0; i < $(boxes).children().length; i += 1){
      currentBox = document.getElementById("boxes").children[i]
      if (currentBox.classList.contains("box-filled-1") || currentBox.classList.contains("box-filled-2")){
        // <---- nothing happens
      } else {
        possibleBoxes.push(currentBox);
      }
    }

    // Pick a random box and mark it
    let randomBox = Math.floor(Math.random() * possibleBoxes.length);

    if(possibleBoxes.length > 0){ // To stop the computer in case there is a tie
      possibleBoxes[randomBox].className = "box box-filled-2";
      possibleBoxes[randomBox].style.backgroundImage = "url('img/x.svg')";

      // Add the new box to the array
      player2Array.push(($(boxes).children().index(possibleBoxes[randomBox])));

      winner();
      changePlayer(player2, player1, "player1");
    }
  }
}();
