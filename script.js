let storedOperation = {};
let clearDisplayNextNum = true;

//Finding the display
display = document.querySelector('.display');

//Finding all the numeric buttons
numericButtons = document.querySelectorAll('.num');
//Add a listener
for(button of numericButtons){
    let val = button.value;
    button.addEventListener('click',
    () => {
        populateDisplay(val);
    }
    );
}

//Finding the operation buttons
operationButtons = document.querySelectorAll('.operation');
//Add a listener
for(button of operationButtons){
    let operation = button.id;
    button.addEventListener('click',
    () => {
        console.log(`Clicked on: ${operation}`);
        queueOperation(operation);
    }
    );
}

//Finding the function buttons
functionButtons = document.querySelectorAll('.func');
//Add a listener
for(button of functionButtons){
    let operation = button.id;
    button.addEventListener('click',
    () => {
        console.log(`Clicked on: ${operation}`);
        functionMap[operation]();
    }
    );
}


let shiftFlag = false;
let keyPressed;
///Capture keycodes anmd handle what happens
window.addEventListener('keydown', keyHandlerDown);
function keyHandlerDown(pressedKey){

    switch(pressedKey.keyCode){
        case 191:
        case 13:
            console.log("Preventing enter or [/] button default behaviour");
            pressedKey.preventDefault();
            break;
        default:
            break;  
    }
        
    keyCode = pressedKey.keyCode;

    if(keyPressed == keyCode) return;
    
    if(keyCode == 16){ 
        shiftFlag = true;
        console.log("SHIFT on");
        return;
    }

    keyPressed = keyCode; //only used to prevent key repetition

    //buttons that don't matter if shift is pressed 
    if(keyCode >= 96 && keyCode <= 105){
        //This is a (numpad) number;
        populateDisplay(keyCode-96);
        return;
    }
    
    switch(keyCode){
        case 111:
            queueOperation('divide');
            break;
        case 106:
            queueOperation('multiply');
            break;
        case 109:
            queueOperation('subtract');
            break;
        case 13:
            enter();
            break;
        case 8:
            back();
            break;
    }

    //Buttons that matter if shift is pressed
    if(shiftFlag)
    {
        switch(keyCode){
            case 56:
                queueOperation('multiply');
            case 187:
                queueOperation('add');
            default:
                break;
        }
    } else {
        if 
        (keyCode >= 48 && keyCode <= 57){
            populateDisplay(keyCode-48);
            
        } else {
            switch(keyCode){
                case 189:
                    queueOperation('subtract');
                    break;
                case 190:
                    decimal();
                    break;
                case 191:
                    queueOperation('divide');
                    break;
                case 187:
                    enter();
                default:
                    break;
            }
        }
    }
    
    return;
}

//Todo: Key up if shift is involved
window.addEventListener('keyup',keyHandlerUp);
function keyHandlerUp(pressedKey){
    keyCode = pressedKey.keyCode;
    switch(keyCode){
        case 16:
            shiftFlag = false;
            console.log("SHIFT off");
            break;
        default:
            keyPressed = '';
            break;
    }
}

/////////////////

function setDisplay(n){
    display.value = n;
    if (display.value.length > 10){
        console.log("TO BIGG");
        display.value = Number(display.value).toExponential(10);
    }
}

function populateDisplay(n, clearFlags = true){
    if(clearFlags == false){clearDisplayNextNum=false;}
    setDisplay(clearDisplayNextNum ? n : display.value+n);
    clearDisplayNextNum = false;
}

//////////////////

function queueOperation(operation){
    //If the stored operation is empty, add the current number on display
    //Then add the operation
    if(!("operation" in storedOperation)){
        storedOperation["value"] = display.value;
        storedOperation["operation"] = operation;
        clearDisplayNextNum = true;
    } 
    //Otherwise.. run the operation and replace the values
    else 
    {
        let result = operationMap[storedOperation.operation](storedOperation.value, display.value);

        storedOperation["value"] = result;
        setDisplay(result);
        storedOperation["operation"] = operation;
        clearDisplayNextNum = true;
    }        
}

////////////////

//Maps strings to operations
let operationMap = {
    "add": add,
    "subtract": subtract,
    "multiply": multiply,
    "divide": divide,
};

function add(a,b){
    return Number(a)+Number(b);
}

function subtract(a,b){
    return a-b;
}

function multiply(a,b){
    return a*b;
}

function divide(a,b){
    return a/b;
}

function operate(a,b,func){
    return func(a,b);
}

////////////////////
let functionMap = {
    "back": back,
    "decimal": decimal,
    "clear": clear,
    "toggleNegative": toggleNegative,
    "enter": enter,
};

function toggleNegative(){
    if(display.value[0] == '-'){
        setDisplay(display.value.slice(1));
    } else {
        setDisplay('-' + display.value);
    }
}

function back(){
    let val = display.value;
    setDisplay(val.slice(0,val.length-1));

    if(display.value ==''){
        clear();
    }
}

function decimal(){
    let reg = /\.+/;
    console.log(display.value.search(reg));
    if(display.value.search(reg) == '-1'){
        populateDisplay('.', false);
    } else {
        return;
    }
}

function clear(){
    setDisplay(0);
    storedOperation = {};
    clearDisplayNextNum = true;
}

function enter(){
    //If the storedoperation is empty, do nothing
    //If there is a number, then do the operation
    if(!("operation" in storedOperation)){
        return;
    } 
    //Otherwise.. run the operation and replace the values
    else 
    {
        let result = operationMap[storedOperation.operation](storedOperation.value, display.value);
        clear();
        setDisplay(result);
    }       
}
