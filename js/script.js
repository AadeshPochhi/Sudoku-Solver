let games=["53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
".......26..37.....9.2.3.8746..37.2.1.74....83..184........5..3.1..924..8",
"3.54.2.6.49.76.1.86..1.3245..39..58.96..587.3.813.4.92.5.6.14..2..549.7.149..73.6",
"3.65.84..52........87....31..3.1..8.9..863..5.5..9.6..13....25........74..52.63..",
"..31..72.7.....5...5.24..3....72......6...8......14....6..95.8...5.....9.49..26.."];

let cells=document.querySelectorAll('.sudoku-input')
let boardval,origBoardVal;
let errorBox=document.querySelector("#error-msg");
let solveButton=document.querySelector("#solve-button");
let clearButton=document.querySelector("#clear-button");
let loadNewButton=document.querySelector("#loadNewBoard-button");

let validateRegex=/^[0-9.]*$/;


document.addEventListener("DOMContentLoaded",()=>{
    loadboard();
    console.log("h");
});

function loadboard(){
    let x = Math.floor((Math.random() * 5) );
    console.log(x);
    boardval=games[x];
    origBoardVal=games[x];
    let values=games[x].split('');
    values.forEach((val,index)=>{
        cells[index].value=val;
    });
};

let gridChanged=()=>{
    let textString="";
    cells.forEach((cell)=>{
        textString+=cell.value.toString();
    });
    errorBox.innerText="";
    if(validateRegex.test(textString)===false){
        errorBox.innerText='Error: Invalid character!';
     
        return;
    }

    if(textString.length !=81){
        errorBox.innerText="Error: Expected puzzle to be 81 characters long!";
        return;
    }
    boardval=textString;
    console.log(boardval);
};

let textStringChanged =()=>{
    let values=boardval.split("");
    values.forEach((val,index)=>{
        cells[index].value=val;
    });
}

cells.forEach((cell)=>{
    cell.oninput=gridChanged;
})

let canPlace= (board,row,col, value)=> {

    // check column
    let i;
    for(i=0;i<9;i++){
        if(board[i][col] === value){
            return false;
        }
    }

    // check row
    let j;
    for(j=0; j<9; j++){
        if(board[row][j] === value){
            return false;
        }
    }

    //check box placement
    let boxTopRow= parseInt(row/3)*3;
    let boxLeftColumn= parseInt(col/3)*3;
    let k,l;
    for(k=boxTopRow ;k<boxTopRow+3; k++){
        for(l=boxLeftColumn; l<boxLeftColumn+3 ;l++ ){
            if(board[k][l] ===  value){
                return false;
            }
        }
    }
    return true;
}

let solveFromCell = (board, row, col)=>{
    if(col===9){
        col=0;
        row++;
    }
    if(row ===9){
        return board;
    }
    if(board[row][col]!='.'){
        return solveFromCell(board,row,col+1);
    }

    let i;
    for(i=1;i<10;i++){
        let valueToPlace= i.toString();
        if(canPlace(board,row,col,valueToPlace)){
            board[row][col]= valueToPlace;
            if(solveFromCell(board,row,col+1)!=false){
                return board;
            }else{
                board[row][col]='.';
            }
        }
    }
    return false;
}

let generateBoard=(values)=>{
    let board=[[],[],[],[],[],[],[],[],[]];
    let boardRow=-1;
    let i;
    for(i=0;i<values.length;i++){
        if(i%9 === 0){
            boardRow+=1;
        }
        board[boardRow].push(values[i]);
    }
    return board;
}

let solveButtonPressed=() => {
    let text=boardval.split('');
    let originalBoard= generateBoard(text);
    
    let solution= solveFromCell(originalBoard,0,0);

    errorBox.innerText="";
    if(solution===false){
        errorBox.innerText="No Solution for the puzzle entered exists :(";
        return;
    }

    let i,j;
    let solutionString="";
    for(i=0;i<solution.length;i++){
        for(j=0; j<solution[i].length;j++){
            solutionString += solution[i][j].toString();
        }
    }
    boardval=solutionString;
    textStringChanged();
}

solveButton.onclick= solveButtonPressed;

clearButton.onclick= ()=>{
    boardval=origBoardVal;
    textStringChanged();
    errorBox.innerText="";
}

loadNewButton.onclick=()=>{
    errorBox.innerText="";
    loadboard();
}