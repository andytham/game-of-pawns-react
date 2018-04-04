$(document).ready(() => {

  let row = ['', '', '', '', '', '', '', ''];
  let col = ['', '', '', '', '', '', '', ''];
  let convertString = "0abcdefgh";
  //chess piece class constructor
  class ChessPiece {
    //rows are called ranks in chess
    //columns are called files in chess
    constructor(piece, color, number, rank, file, isAlive, isSelected, isEnPassantable, enPassantTimer) {
      this.piece = piece;
      this.color = color;
      this.number = number;
      this.rank = rank;
      this.file = file;
      this.isAlive = isAlive;
      this.isSelected = isSelected;
      this.isEnPassantable = isEnPassantable;
      this.enPassantTimer = enPassantTimer;
    }
    pushIntoArray() {
      //eval(this.color+"Pieces").push(this);
      //depends if I want one or two arrays;
      piecesInPlay.push(this);
      //https://stackoverflow.com/questions/5613834/convert-string-to-variable-name-in-javascript
      //includes other methods instead of eval();
    }
  }


  const whitePieces = [];
  const blackPieces = [];
  // which is better
  let piecesInPlay = [];
  let gameWin = false;
  let winnerColor = "who knows";

  const createPawns = function createBothPlayersPawns() {
    const whitepawn1 = new ChessPiece("pawn", "white", 1, 2, 1, true, false, false, 0);
    const whitepawn2 = new ChessPiece("pawn", "white", 2, 2, 2, true, false, false, 0);
    const whitepawn3 = new ChessPiece("pawn", "white", 3, 2, 3, true, false, false, 0);
    const whitepawn4 = new ChessPiece("pawn", "white", 4, 2, 4, true, false, false, 0);
    const whitepawn5 = new ChessPiece("pawn", "white", 5, 2, 5, true, false, false, 0);
    const whitepawn6 = new ChessPiece("pawn", "white", 6, 2, 6, true, false, false, 0);
    const whitepawn7 = new ChessPiece("pawn", "white", 7, 2, 7, true, false, false, 0);
    const whitepawn8 = new ChessPiece("pawn", "white", 8, 2, 8, true, false, false, 0);
    const blackpawn1 = new ChessPiece("pawn", "black", 1, 7, 8, true, false, false, 0);
    const blackpawn2 = new ChessPiece("pawn", "black", 2, 7, 7, true, false, false, 0);
    const blackpawn3 = new ChessPiece("pawn", "black", 3, 7, 6, true, false, false, 0);
    const blackpawn4 = new ChessPiece("pawn", "black", 4, 7, 5, true, false, false, 0);
    const blackpawn5 = new ChessPiece("pawn", "black", 5, 7, 4, true, false, false, 0);
    const blackpawn6 = new ChessPiece("pawn", "black", 6, 7, 3, true, false, false, 0);
    const blackpawn7 = new ChessPiece("pawn", "black", 7, 7, 2, true, false, false, 0);
    const blackpawn8 = new ChessPiece("pawn", "black", 8, 7, 1, true, false, false, 0);
    for (i = 1; i < 9; i++) {
      eval("whitepawn" + i).pushIntoArray();
      eval("blackpawn" + i).pushIntoArray();
    }
    // console.log(piecesInPlay[1]);
    // console.log(piecesInPlay);
    // console.log(piecesInPlay[0].piece)
  }
  const restartGame = function restartGameAndResetEverything() {
    gameWin = false;
    winnerColor = "who knows";
    playerTurn = "white";
    piecesInPlay = [];

    $(".discard").remove();
    removeClicks();
    hideGameWin();
    wipeBoard();
    createBoard();
    createPawns();
    render();
    restartLandingPage();

  }

  const render = function placeChessPiecesBasedOnLocation() {
    //console.log(piecesInPlay);
    wipeBoard();
    createBoard();
    removeClicks();
    let $currentPlayer = $("#current-player");
    if (playerTurn == "white") {
      $currentPlayer.text($(player1).val() + "\'s turn");
      $currentPlayer.css({
        "text-shadow": "0 0 0.4em black, 0 0 0.4em black", //trying to add glow
        "font-weight": "400",
        "color": "white"
      });
    } else if (playerTurn == "black") {
      $currentPlayer.text($(player2).val() + "\'s turn");
      $currentPlayer.css({
        "text-shadow": "0 0 0.2em white, 0 0 0.2em white", //trying to add glow
        "font-weight": "700",
        "color": "black"
      });
    }
    for (let entry of piecesInPlay) {
      //console.log(entry);
      // wipe board?
      if (entry.enPassantTimer == 1) { //disable en passant is timing missed
        entry.isEnPassantable = false;
        entry.enPassantTimer = 0;
      }
      if (entry.isEnPassantable == true) { //allow en passant, must be done on first turn possible
        entry.enPassantTimer = 1;
      }
      //checks if piece is alive then places on board
      if (entry.isAlive === true) {
        let $currentPieceLocation = $(".row" + entry.rank + ".col" + entry.file);
        let $newPiece = $("<img>").attr("src", `images/${entry.color}${entry.piece}.png`);
        $currentPieceLocation.attr({
          "data-color": entry.color,
          "data-piece": entry.piece,
          "data-number": entry.number,
          "data-isAlive": entry.isAlive
        });
        //console.log($currentPieceLocation);
        $currentPieceLocation.append($newPiece);
        $currentPieceLocation.click(selectPiece);
        // $currentPieceLocation.css("background", `url('images/${entry.piece}.png')`);
      }
      if (entry.piece == "queen") {
        gameWin = true;
        winnerColor = entry.color;
      }
      if (gameWin == true) {
        playerTurn = "none";
        removeClicks();
        let $winPage = $("#win-page");
        let $winText = $("#win-text");
        let $restart = $("#restart");
        $restart.click(restartGame);
        if (winnerColor == "white") {
          $winText.text($(player1).val().toUpperCase() + " WINS!");
          $winPage.css({
            "text-shadow": "0 0 0.4em black, 0 0 0.4em black",
            "color": "white",
            "z-index": "2"
          });
        } else if (winnerColor == "black") {
          $winText.text($(player2).val().toUpperCase() + " WINS!");
          $winPage.css({
            "text-shadow": "0 0 0.2em white, 0 0 0.2em white",
            "color": "black",
            "z-index": "2"
          });
        }
        $winPage.animate({
            "top": "290px",
            "opacity": "1"
          },
          800);
        $restart.animate({
          "top": "0px",
          "opacity": "1"
        }, 1000);
      }
    }
    // for(i = 0; i < piecesInPlay.length; i++){
    //   console.log(this);
    // }
    //console.log(piecesInPlay);
    console.log("hey do something");
    let $historyButton = $("#history-button"); //clickable history button
    if ($historyButton.attr("value") == "display history"){
          console.log('displayHistory running')
      $historyButton.click(displayHistory);
    } else if ($historyButton.attr("value") == "hide history"){
          console.log('hide history running')
      $historyButton.click(hideHistory);
    }
  } //end of render
  const updateHistory = function updateHistory(rank, file, player) {
    console.log('history updated');
    let $history1 = $("#history1");
    let $history2 = $("#history2");
    let letterFile = convertString.charAt(file);
    if(player == "white"){
      $history1.append("<div>" + letterFile + rank + " " + "</div>");
      console.log('white just moved');
    } else if(player == "black"){
      $history2.append("<div>"+ "-"+ letterFile + rank + "</div>");
      console.log('black just moved');
    }
  }
  const displayHistory = function displayHistory(){

    let $historyButton = $("#history-button");
    let $historyContainer = $("#history-container");

    $historyContainer.css("display","flex");
    $historyButton.attr("value", "hide history");
    $historyButton.click(hideHistory);
  }
  const hideHistory = function hideHistory(){

    let $historyButton = $("#history-button");
    let $historyContainer = $("#history-container");

    $historyContainer.css("display","none");
    $historyButton.attr("value", "display history");
    $historyButton.click(displayHistory);
    ;
  }

  const hideGameWin = function restartGameWinHideWindow() {
    let $winPage = $("#win-page");
    console.log("hiding game win page");
    $winPage.stop(true, false).animate({
      "top": "500px",
      "opacity": "0"
    }, 700);
    $winPage.css("z-index", "-1");
    console.log("hiding game win page 2");
  }


  let instaWin = function() {
    let winTest = $("#wt");
    console.log($(winTest));
    winTest.click(function() {
      console.log('click test');
      gameWin = true;
      winnerColor = "white";
    });
  }


  //select piece for action
  let playerTurn = "white";

  const selectPiece = function selectPiece() {

    $checkAll = $(this);
    //console.log($selected);
    let tempMoves = [];
    let possibleMoves = [];

    let findColor = $checkAll.attr("data-color");
    let findPiece = $checkAll.attr("data-piece");
    let findNumber = $checkAll.attr("data-number");
    let selectedChessPiece = piecesInPlay.filter(function(selPiece) { //grab the selected piece from the object array
      return selPiece.color == findColor && selPiece.piece == findPiece && selPiece.number == findNumber;
    });
    if (playerTurn == "white") {
      if (selectedChessPiece[0].color == "white") { //white pawn possible moves
        let rankFix = Number(selectedChessPiece[0].rank);
        let fileFix = Number(selectedChessPiece[0].file);
        let rank1Fix = Number(selectedChessPiece[0].rank) + 1;
        let rank2Fix = Number(selectedChessPiece[0].rank) + 2;
        let file1Fix = Number(selectedChessPiece[0].file) + 1;
        let fileRev1Fix = Number(selectedChessPiece[0].file) - 1;

        let move0 = $(".row" + rankFix + ".col" + fileFix);
        let move1 = $(".row" + rank1Fix + ".col" + fileFix);
        let move2 = $(".row" + rank2Fix + ".col" + fileFix);
        let move3 = $(".row" + rank1Fix + ".col" + file1Fix);
        let move4 = $(".row" + rank1Fix + ".col" + fileRev1Fix);
        let move5 = $(".row" + rankFix + ".col" + file1Fix); //en passant to the right
        let move6 = $(".row" + rankFix + ".col" + fileRev1Fix); //en passant to the left
        removeClicks();
        move0.css("border", "2px #4283ED solid");
        move0.click(function() {
          console.log("canceled click");
          render();
        })

        if (move1.attr("data-isAlive") == "false") {
          //set click event on this
          move1.css("border", "2px red solid");
          move1.click(function() { //single move forward
            //regex help, updates the position of the selected piece
            //https://stackoverflow.com/questions/10003683/javascript-get-number-from-string
            currentTarget = $(this).attr("class");
            let findPosRegex = currentTarget.match(/\d/g);
            selectedChessPiece[0].file = findPosRegex[0];
            selectedChessPiece[0].rank = findPosRegex[1];
            if (selectedChessPiece[0].rank == 8) {
              console.log("reached promotion");
              selectedChessPiece[0].piece = "queen"; //promote to queen
              console.log(selectedChessPiece[0].piece);
              render();
            }
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "black";

            console.log('call upon history func');

            render();
          })

          console.log(move2.attr("data-isAlive"));
          if (move2.attr("data-isAlive") == "false" && selectedChessPiece[0].rank == 2) { //double move forward
            move2.css("border", "2px red solid");
            move2.click(function() {
              currentTarget = $(this).attr("class");
              let findPosRegex = currentTarget.match(/\d/g);
              selectedChessPiece[0].file = findPosRegex[0];
              selectedChessPiece[0].rank = findPosRegex[1];
              selectedChessPiece[0].isEnPassantable = true;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "black";
              render();
            });
          }
          console.log(move1.attr("data-isAlive"));
        } else if (move1.attr("data-isAlive") == "true") {
          console.log('something in the way');
        } else {
          console.log('something broke');
        }
        if (move3.attr("data-isAlive") == "true" && move3.attr("data-color") == "black") {
          let targetColor = move3.attr("data-color");
          let targetPiece = move3.attr("data-piece");
          let targetNumber = move3.attr("data-number");
          let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
            return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
          });
          move3.css("border", "2px red solid");
          move3.click(function() {
            targetChessPiece[0].isAlive = false;
            selectedChessPiece[0].rank = targetChessPiece[0].rank;
            selectedChessPiece[0].file = targetChessPiece[0].file;
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "black";
            render();
          });
        } else if (move5.attr("data-isAlive") == "true" && move5.attr("data-color") == "black" && move5.attr("data-piece") == "pawn") { // En passant to the right
          let targetColor = move5.attr("data-color");
          let targetPiece = move5.attr("data-piece");
          let targetNumber = move5.attr("data-number");
          let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
            return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
          });

          if (targetChessPiece[0].isEnPassantable == true) {

            move3.css("border", "2px red solid");
            move3.click(function() {
              targetChessPiece[0].isAlive = false;
              selectedChessPiece[0].rank = rank1Fix;
              selectedChessPiece[0].file = file1Fix;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "black";
              render();
            });
          }
        }
        if (move4.attr("data-isAlive") == "true" && move4.attr("data-color") == "black") {
          move4.css("border", "2px red solid");
          move4.click(function() {
            let targetColor = move4.attr("data-color");
            let targetPiece = move4.attr("data-piece");
            let targetNumber = move4.attr("data-number");
            let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
              return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
            });
            targetChessPiece[0].isAlive = false;
            selectedChessPiece[0].rank = targetChessPiece[0].rank;
            selectedChessPiece[0].file = targetChessPiece[0].file;
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "black";
            render();
          });
        } else if (move6.attr("data-isAlive") == "true" && move6.attr("data-color") == "black" && move6.attr("data-piece") == "pawn") { // En passant to the right
          let targetColor = move6.attr("data-color");
          let targetPiece = move6.attr("data-piece");
          let targetNumber = move6.attr("data-number");
          let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
            return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
          });

          if (targetChessPiece[0].isEnPassantable == true) {

            move4.css("border", "2px red solid");
            move4.click(function() {
              targetChessPiece[0].isAlive = false;
              selectedChessPiece[0].rank = rank1Fix;
              selectedChessPiece[0].file = fileRev1Fix;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "black";
              render();
            });
          }
        }
      } //end of white pawn logic
    } //end of player check
    else if (playerTurn == "black") {
      if (selectedChessPiece[0].color == "black") { //black pawn possible moves
        let rankFix = Number(selectedChessPiece[0].rank);
        let fileFix = Number(selectedChessPiece[0].file);
        let rank1Fix = Number(selectedChessPiece[0].rank) - 1;
        let rank2Fix = Number(selectedChessPiece[0].rank) - 2;
        let file1Fix = Number(selectedChessPiece[0].file) - 1;
        let fileRev1Fix = Number(selectedChessPiece[0].file) + 1;

        let move0 = $(".row" + rankFix + ".col" + fileFix);
        let move1 = $(".row" + rank1Fix + ".col" + fileFix);
        let move2 = $(".row" + rank2Fix + ".col" + fileFix);
        let move3 = $(".row" + rank1Fix + ".col" + file1Fix);
        let move4 = $(".row" + rank1Fix + ".col" + fileRev1Fix);
        let move5 = $(".row" + rankFix + ".col" + file1Fix); //en passant to their right
        let move6 = $(".row" + rankFix + ".col" + fileRev1Fix); //en passant to their left
        removeClicks();

        move0.css("border", "2px #4283ED solid");
        move0.click(function() {
          console.log("canceled click");
          render();
        })

        if (move1.attr("data-isAlive") == "false") {
          //set click event on this
          move1.css("border", "2px red solid");
          move1.click(function() { //single move forward
            //regex help, updates the position of the selected piece
            //https://stackoverflow.com/questions/10003683/javascript-get-number-from-string
            currentTarget = $(this).attr("class");
            let findPosRegex = currentTarget.match(/\d/g);
            selectedChessPiece[0].file = findPosRegex[0];
            selectedChessPiece[0].rank = findPosRegex[1];
            if (selectedChessPiece[0].rank == 1) {
              console.log("reached promotion");
              selectedChessPiece[0].piece = "queen"; //promote to queen
              console.log(selectedChessPiece[0].piece);
              render();
            }
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "white";
            render();
          })

          console.log(move2.attr("data-isAlive"));
          if (move2.attr("data-isAlive") == "false" && selectedChessPiece[0].rank == 7) { //double move forward
            move2.css("border", "2px red solid");
            move2.click(function() {
              currentTarget = $(this).attr("class");
              let findPosRegex = currentTarget.match(/\d/g);
              selectedChessPiece[0].file = findPosRegex[0];
              selectedChessPiece[0].rank = findPosRegex[1];
              selectedChessPiece[0].isEnPassantable = true;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "white";
              render();
            });
          }
          console.log(move1.attr("data-isAlive"));
        } else if (move1.attr("data-isAlive") == "true") {
          console.log('something in the way');
        } else {
          console.log('something broke');
        }
        console.log("isalive" + move3.attr("data-isAlive") + "COLOR" + move3.attr("data-color"))
        if (move3.attr("data-isAlive") == "true" && move3.attr("data-color") == "white") {
          console.log('MOVE 3 TRYING TO EXECUTE')
          move3.css("border", "2px red solid");
          move3.click(function() {
            let targetColor = move3.attr("data-color");
            let targetPiece = move3.attr("data-piece");
            let targetNumber = move3.attr("data-number");
            let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
              return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
            });
            targetChessPiece[0].isAlive = false;
            selectedChessPiece[0].rank = targetChessPiece[0].rank;
            selectedChessPiece[0].file = targetChessPiece[0].file;
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "white";
            render();
          });
        } else if (move5.attr("data-isAlive") == "true" && move5.attr("data-color") == "white" && move5.attr("data-piece") == "pawn") { // En passant to the right
          let targetColor = move5.attr("data-color");
          let targetPiece = move5.attr("data-piece");
          let targetNumber = move5.attr("data-number");
          let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
            return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
          });

          if (targetChessPiece[0].isEnPassantable == true) {

            move3.css("border", "2px red solid");
            move3.click(function() {
              targetChessPiece[0].isAlive = false;
              selectedChessPiece[0].rank = rank1Fix;
              selectedChessPiece[0].file = file1Fix;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "white";
              render();
            });
          }
        }
        if (move4.attr("data-isAlive") == "true" && move4.attr("data-color") == "white") {
          move4.css("border", "2px red solid");
          move4.click(function() {
            let targetColor = move4.attr("data-color");
            let targetPiece = move4.attr("data-piece");
            let targetNumber = move4.attr("data-number");
            let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
              return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
            });
            targetChessPiece[0].isAlive = false;
            selectedChessPiece[0].rank = targetChessPiece[0].rank;
            selectedChessPiece[0].file = targetChessPiece[0].file;
            let historyRegex = currentTarget.match(/\d/g);
            updateHistory(historyRegex[1],historyRegex[0],playerTurn);
            playerTurn = "white";
            render();
          })
        } else if (move6.attr("data-isAlive") == "true" && move6.attr("data-color") == "white" && move6.attr("data-piece") == "pawn") { // En passant to the right
          let targetColor = move6.attr("data-color");
          let targetPiece = move6.attr("data-piece");
          let targetNumber = move6.attr("data-number");
          let targetChessPiece = piecesInPlay.filter(function(tarPiece) {
            return tarPiece.color == targetColor && tarPiece.piece == targetPiece && tarPiece.number == targetNumber;
          });

          if (targetChessPiece[0].isEnPassantable == true) {

            move4.css("border", "2px red solid");
            move4.click(function() {
              targetChessPiece[0].isAlive = false;
              selectedChessPiece[0].rank = rank1Fix;
              selectedChessPiece[0].file = fileRev1Fix;
              let historyRegex = currentTarget.match(/\d/g);
              updateHistory(historyRegex[1],historyRegex[0],playerTurn);
              playerTurn = "white";

              render();
            });
          }
        }
      } //end of black pawn logic
    } //end of player check
  }

  const removeClicks = function clearClickEvents() {
    $("*").off("click");
  }
  const wipeBoard = function wipeBoardToRerender() {
    $(".col").remove();
  }

  const removePiece = function removePieceFromBoard() {
    $(this).detach();
  }

  const $board = $('#board');

  const createBoard = function createChessBoard() {
    for (i = 1; i < col.length + 1; i++) {
      let $colCreate = $("<div>", {
        "class": "col col" + i
      });
      $board.append($colCreate);
      let $grabCurrentCol = $(".col" + i);
      //create row entries
      for (j = row.length; j > 0; j--) {
        let $rowCreate = $("<div></div>", {
          "class": "row col" + i + " row" + j
        });
        $rowCreate.addClass("brown");
        $rowCreate.attr("data-isAlive", false);
        //checkerize the background
        if (i % 2 == 0 && j % 2 == 1) {
          $rowCreate.removeClass("brown")
          $rowCreate.addClass("beige");
        }
        if (i % 2 == 1 && j % 2 == 0) {
          $rowCreate.removeClass("brown")
          $rowCreate.addClass("beige");
        }
        $grabCurrentCol.append($rowCreate);
      }
    }
  }

  const landingPage = function loadLandingPageFunctions(event) {
    let $landingPage = $("#landing-page");
    let $continue = $("#continue");
    let $player1 = $("#player1");
    let $player2 = $("#player2");
    let $boardOpacity = $("#board");
    let $currentPlayerOpacity = $("#current-player");

    $continue.click(function() {
      let $historyButton = $("#history-button");
      $historyButton.css("display","block");
      $landingPage.animate( //bounce effect its kinda lame
        {
          "top": "600px"
        },
        100);
      $landingPage.animate({
          "top": "-150px",
          "opacity": ".5"
        },
        100);

      $boardOpacity.animate({
          "opacity": "1"
        },
        800);
      $currentPlayerOpacity.animate({
          "opacity": "1"
        },
        800);

      let player1 = $player1.val();
      let player2 = $player2.val();
      let $initPlayerText = $("#current-player");
      $initPlayerText.text($player1.val() + "\'s turn");
    });
  }
  const restartLandingPage = function landingPageAfterRestartButton() {
    let $landingPage = $("#landing-page");
    let $continue = $("#continue");
    let $player1 = $("#player1");
    let $player2 = $("#player2");
    let $boardOpacity = $("#board");
    let $currentPlayerOpacity = $("#current-player");

    //hide display history button
    let $historyButton = $("#history-button");
    $historyButton.css("display","none");

    $landingPage.animate( //bounce effect its kinda lame
      {
        "top": "100px",
        "opacity": "1"
      },
      100);
    $boardOpacity.animate({
        "opacity": "0"
      },
      800);
    $currentPlayerOpacity.animate({
        "opacity": "0"
      },
      800);
    landingPage();
  }

  createBoard();
  createPawns();
  render();
  landingPage();
  instaWin();
}); //end of jquery
