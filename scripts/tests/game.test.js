/**
 * @jest-environment jsdom
 */



const {game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn} = require('../game');

jest.spyOn(window, 'alert').mockImplementation(() => { });

beforeAll(() => {  // typical boilerplate document loading code block
    let fs = require('fs');
    let fileContents = fs.readFileSync('index.html', 'utf-8');
    document.open();
    document.write(fileContents);
    document.close();    
});

describe('game object contains the correct keys', () => {
    test('score key exists', () => {
        expect('score' in game).toBe(true);
    });
    test('currentGame key exists', () => {
        expect('currentGame' in game).toBe(true);
    });
    test('playerMoves key exists', () => {
        expect('playerMoves' in game).toBe(true);
    });
    test('choices key exists', () => {
        expect('choices' in game).toBe(true);
    });
    test('choices contains the correct ids', () => {
        expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
    });
    test('lastButton key exists', () => {
        expect('lastButton' in game).toBe(true);
    });
    test('turnInProgress key exists', () => {
        expect('turnInProgress' in game).toBe(true);
    });
    test('turnInProgress key exists', () => {
        expect(game.turnInProgress).toEqual(false);
    });
});

describe('newGame works correctly', () => {
    beforeAll(() => {  // this runs before all tests have been run
        game.score = 42;
        game.playerMoves = ['button1','button2'];
        game.currentGame = ['button1','button2'];
        document.getElementById('score').innerText = '42';
        newGame();
    });
    test('should set the game score to zero', ()=> {
        expect(game.score).toEqual(0);
    });
    test('should be one move in the computers game array', ()=> {
        expect(game.currentGame.length).toBe(1);
    });
    test('should set the playerMoves to an empty array', ()=> {
        expect(game.playerMoves.length).toEqual(0);
    });
    
    test('should display zero in the element with an id of score', ()=> {
        expect(document.getElementById('score').innerText).toEqual(0);
    });
    test('turnNumber key exists', () => {
        expect('turnNumber' in game).toBe(true);
    });
    test('expect data-listener to be true', () => {
        const elements = document.getElementsByClassName('circle');
        for(let element of elements){
            expect(element.getAttribute('data-listener')).toEqual('true');
        }        
    });
});

describe('gameplay works correctly', () => {
    beforeEach(() => {   // this runs before each test is performed
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() =>{  // this runs after each test is performed
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test('addTurn adds a new turn to the game', () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test('should add the correct class to light up the buttons', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');  // this checks the button classlist to check if it contains the class 'light'
    });
    test('show turns should update game turn number', () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });  
    test('should increment the score if the turn is correct', () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test('should call an alert if the move is wrong', () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toBeCalledWith('Wrong-move!');
    });
    test('turnInProgress key exists', () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test('clicking during the computer sequence should fail', () => {
        showTurns();
        game.lastButton = '';
        document.getElementById('button2').click();
        expect(game.lastButton).toEqual('');
    });
});