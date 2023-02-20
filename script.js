const buttons = document.querySelectorAll('.btn');
const display = document.querySelector('#display')

let a; // First Number
let b; // Second number
let nextNumberInSequence = ''; // The next number in a case of a sequence of operators

let result; // The result of the operators
let action; // Which operator
let inSequence = false; // If the user has started a sequence or not

// Sequence, referring to using more than one operator at a time.

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        //CLEAR
        if(button.textContent == "CLEAR"){
            display.textContent = '0';
            a = null;
            b = null;
            inSequence = false;
        }
        //BACKSPACE
        else if(button.textContent == "DELETE"){

            //In a case of a sequence, allow to delete only the next number.
            if(inSequence){
                if(nextNumberInSequence != ''){
                    nextNumberInSequence = nextNumberInSequence.slice(0, -1);
                    display.textContent = display.textContent.slice(0, -1);
                }
            }

            //Otherwise, allow to delete until there's only one digit left, when there's a single digit left, if the user backspaces, return to 0.
            else{
                if(display.textContent.length > 1)
                    display.textContent = display.textContent.slice(0, -1);
                else
                    display.textContent = '0';
            }
        }
        else if(button.id == "equals"){
            if(a != null && /\d/.test(display.textContent) == true)
                operate('=');
        }
        //DECIMAL
        else if(button.id == 'decimal'){
            let decimal = '.';
            if(/\d/.test(display.textContent) == false){
                decimal = '0.'
                display.textContent = '';
            }
            if(inSequence && !nextNumberInSequence.includes('.')){
                display.textContent += decimal;
                nextNumberInSequence += decimal;
            }
            else if(!display.textContent.includes('.')){
                display.textContent += decimal;
            }
        }
        //OPERATORS
        else if(button.classList.contains('operator')){
            operate(button.textContent);
        }
        //NUMBERS
        else if(!isNaN(button.textContent)){
            if(display.textContent == '0' || /\d/.test(display.textContent) == false) //If the number on the screen is 0, 
            //change the number on the display instead of adding onto it, since it's a string,
            //and if there's only an operator on the screen, meaning the app is waiting for a number, 
            //once again, change the string of the display instead of adding onto it.
                display.textContent = button.textContent;
            else{
                if(inSequence){ //In a case of a sequence, store the numbers inside the variable, and later access it as the second number to operate with.
                    nextNumberInSequence += button.textContent;
                }
                display.textContent += button.textContent;
            }
        }
    })
});

function operate(actionButton){
    if(a == null){ //Input for the first number
        a = display.textContent; //Set the first number (a) to be the number on display
        display.textContent = actionButton; //Display which operator is going to be used
        action = actionButton; //Store which operator has been chosen to be used, since the operator will keep changing every time we call this function
    }
    else if(b == null){ //Input for the second number
        if(actionButton == "="){ //Handling the equals sign
            if(inSequence){ //If the user has pressed the equals sign after using multiple operators

                if(nextNumberInSequence == '') //If no second number has been entered, don't do anything.
                    return;

                b = nextNumberInSequence //Second number will equal to the number that is after the operator on the display

                result = Math.round(calculate(action) * 100) / 100
                display.textContent = result; //Display the result

                a = null; //Reset the two numbers
                b = null; 

                inSequence = false;
            }
            else{ //If the user has pressed the equals sign after using only one operator
                b = display.textContent; //Second number will equal to the number on the display

                result = Math.round(calculate(action) * 100) / 100 
                display.textContent = result; //Display the result

                a = null; //Reset the two numbers
                b = null;
            }
        }
        else{ 
            // #region Example to how a sequence works 
            //An example to how this works (this is meant to be read after reading the comments below):
            //The user enters 3 * 2

            //The display will look like this in order:
            //3
            //*
            //2

            //The user presses the - operator

            //This part of the code runs, since the first number (a) now equals to 3 (a has been set to 3 when the user pressed the * operator),
            //and the second number (b) is still null, and the user pressed an operator, not an equals sign.

            //the default of inSequence is false, so the second number (b) will equal to what's on the display.
            //The result will equal to 3 * 2, since a = 3, b = 2, and action, the variable that is being sent to the calculate function, equals to * since action has been set
            //to * when the user pressed the * operator, and a was set to 3.

            //Now to display the result, it will print the result, space, the actionButton which is the operator that has been pressed the second time (-), and another space.
            //actionButton equals to the operator that has been pressed to call this function.

            //The display now looks like this:
            // 6 -

            //The first number (a) now equals to the result (6), so when the function calculate() runs, it will use the result as the first number, since it's the number that
            //the user wants to operate on in the sequence.

            //action now equals to - since actionButton equals to the operator that was pressed to call this function.
            //Now when the user will enter a third number (b, which is referred to as the second number, but this will be the third number the user enters), and press an operator,
            //it will first calculate using the - operator since action still equals to -, and only then it will update action.

            //Reset b to null because now we need a new second number.

            //inSequence = true because now the user is officialy in the sequence.

            //Reset the nextNumberInSequence because every time this part of the code runs, we want a new second number.

            //The user now enters 5, and then presses *

            //nextNumberInSequence equals to 5 since inSequence true and when inSequence is true, nextNumberInSequence will equal to the number that is being entered.

            //Display in order:
            // 6 - 5
            // 1 *

            //Since inSequence is true, b will equal to nextNumberInSequence, which is 5 as I've explained above.
            //result will be calculated using a, which equals to the result from before like we said, which is 6, b as we said the line above, equals to nextNumberInSequence,
            //which is 5, and it uses the variable "action" which is still the - operator.

            //Display the result with actionButton which is the operator that called this function (*).

            //Now a equals to the result, which is 1, in order to use it for the next pair of numbers.
            //Now is when action is updated to the operator that called this function, which is stored in actionButton, which equals to *
            
            //The second number resets since we want the user to now enter a new number.
            //inSequence is still true and nextNumberInSequence gets reset since now we want a new number.

            //END OF EXAMPLE
            // #endregion

            if(/\d/.test(display.textContent) != true){ //If there aren't any numbers on the screen, meaning omly an operator, change the action, display it, and return.
                action = actionButton;
                display.textContent = actionButton;
                return;
            }

            //If the user has gotten to this part of the code, it means he's initiating a sequence, since this part of the code only runs if
            //an operator has been used more than once
            //before pressing the equlas sign, meaning he's operating on more than two numbers with multiple operators

            //For example: 3 * 2 - 8 + 2
            //If the user would've pressed the equals sign after 3 * 2, they wouldn't have gotten to this part of the code and not initiating a sequence.

            if(inSequence){ //The first time this part of the code runs, the user won't immediately enter the sequence, because we need to first calculate the first pair of numbers,
            //after the first pair of numbers have been calculated with the operator that was first chosen when the first number was entered (a), only then we can enter the sequence,
            //and the action, will be the operator that has been entered when this code ran, and the second number (b) will be "nextNumberInSequence", which as I've explained before,
            //is a variable that stores the numbers that are being entered, after the first pair of numbers was calculated and a sequence has been initiated.

            //Notice: "nextNumberInSequence" gets reset every time this part of the code runs

                if(nextNumberInSequence == ''){ //If no second number has been entered to be calculated with, only change which operator is going to be used, and return.
                    display.textContent = result + " " + actionButton + ' ';
                    action = actionButton;
                    return;
                }

                if(nextNumberInSequence == '.')
                    nextNumberInSequence = 0;

                b = nextNumberInSequence; //The second number (b) is what the user is entering after the first pair of numbers were calculated.
            }
            else //This is what runs the first time the person initiates a sequence, because as I've explained above, we first need to calculate the first pair of numbers,
            //Only then, the second number (b), will equal to the number that will be entered.
                b = display.textContent;

            result = Math.round(calculate(action) * 100) / 100;
            display.textContent = result + " " + actionButton + ' ';

            a = result;
            b = null;

            action = actionButton;
            nextNumberInSequence = '';

            inSequence = true;
        }
    }

}

function calculate(operator){
    if(a == '-')
        a = 0;
    if(b == '-')
        b = 0;
    
    if(operator == '*')
        return a * b;
    if(operator == '-')
        return a - b;
    if(operator == '+')
        return +a + +b;
    if(operator == '/')
        return a / b;
}