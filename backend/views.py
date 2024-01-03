import random
import sys
import json
from flask import Blueprint, jsonify, request

views = Blueprint(__name__, 'views')


def newBoard():
    
    #Генерира нова дъска (празен двумерен лист от нули).
    
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


def saveGame(filename, data):
    
    #Saves the provided data into a file.
    
    try:
        with open(filename + ".txt", "w") as file:
            json.dump(data, file)
    except Exception as e:
        print(f"Couldn't save the data. Exiting now. Error: {e}")
        sys.exit()

def loadGame(filename):
    
    #Зарежда запаметена игра от файл.
    
    print(filename)
    try:
        with open(filename + ".txt", "rb") as file:
            return json.load(file)
    except FileNotFoundError:
        alert = "File with that name hasn't been found!"
        print(alert)
        sys.exit()

# def printBoard(board):
#     """
#     Печата форматираната дъска.
#     """
#     for row in board:
#         print("|" + "|".join([" " if cell == 0 else "O" if cell == 1 else "X" for cell in row]) + "|")
#     print()

def validMove(row, column, board):
    
    #Проверява валидността на позиция.
    
    return 0 <= row < 3 and 0 <= column < 3 and board[row][column] == 0

# def makeMove(row, column, board):
#     """
#     Извършва ход на човешкия играч.
#     """
#     board[row][column] = -1
#     return board

def checkWinnerV(turn, board):
    
    #Проверява дали играчът има три последователни марки вертикално.
    
    for col in range(3):
        if all(board[row][col] == turn for row in range(3)):
            return True
    return False

def checkWinnerH(turn, board):
    
    #Проверява дали играчът има три последователни марки хоризонтално.
    
    for row in range(3):
        if all(board[row][col] == turn for col in range(3)):
            return True
    return False

def checkWinnerD(turn, board):
    
    #Проверява дали играчът има три последователни марки диагонално.
    
    return all(board[i][i] == turn for i in range(3)) or all(board[i][2 - i] == turn for i in range(3))

def checkWinner(turn, board):
    
    #Проверява дали играчът има три последователни марки по който и да е начин.
    
    return checkWinnerH(turn, board) or checkWinnerV(turn, board) or checkWinnerD(turn, board)

def find_empty_spaces(board):
    empty_spaces = [(i, j) for i in range(3) for j in range(3) if board[i][j] == 0]
    return empty_spaces

def computerMove(board, turnsPlayer, turnsComp):
    empty_spaces = find_empty_spaces(board)
    if empty_spaces:
        i, j = random.choice(empty_spaces)
        board[i][j] = 2  # Assuming the bot is player 2
        turnsComp[i][j] = 2  # Mark the move in turnsComp
    return board, turnsPlayer, turnsComp

def checkFull(board):
    
    #Проверява дали дъската е запълнена.
    
    return all(cell != 0 for row in board for cell in row)




nickname = "Martin"  # Global variable to store the nickname
turnsComp = newBoard()  # Create a new game board
turnsPlayer = newBoard()
board = newBoard()
turn = -1
playerCounter = 0
compCounter = 0
drawCounter = 0

@views.route("/game", methods=["GET", "POST"])
def game():
    global nickname
    global turnsComp
    global turnsPlayer
    global board
    global turn
    global playerCounter
    global compCounter
    global drawCounter

    if request.method == "POST":
        # Handle the POST request here
        data = request.get_json()

        if 'newGame' in data:
            turnsComp =  data['turnsComp']
            turnsPlayer = data['turnsPlayer']
            board = data['board']
            turn = data['turn']
            playerCounter = data['playerCounter']
            compCounter = data['compCounter']
            drawCounter = data['drawCounter']

        if 'enterGame' in data:
            turnsComp =  data['turnsComp']
            turnsPlayer = data['turnsPlayer']
            board = data['board']
            turn = data['turn']
            nickname = data['nickname']
            playerCounter = data['playerCounter']
            compCounter = data['compCounter']
            drawCounter = data['drawCounter']



        if 'saveGame' in data: 
            saveGame(nickname, data)  # Save the game
        
        if 'loadGame' in data and 'nickname' in data:
            data = loadGame(nickname)
            turnsComp =  data['turnsComp']
            turnsPlayer = data['turnsPlayer']
            board = data['board']
            turn = data['turn']
            nickname = data['nickname']
            playerCounter = data['playerCounter']
            compCounter = data['compCounter']
            drawCounter = data['drawCounter']

        if 'check' in data:
            turn = data['turn']
            return jsonify({
                "player" : checkWinner(-1, data['turnsPlayer']),
                "computer" : checkWinner(2, data['turnsComp']),
                "full": checkFull(data['board']),
            }), 200
        
        if 'computerMove' in data:
            turn = data['turn']
            turnsPlayer = data['turnsPlayer']
            turnsComp = data['turnsComp']
            board = data['board']
            
            return jsonify({
                "computerMove": computerMove(board, turnsPlayer, turnsComp),
                "turn": turn,
            }), 200

        return jsonify
        
    else:

        return jsonify({
            "turnsComp": turnsComp,
            "turnsPlayer": turnsPlayer,
            "board": board,
            "turn": turn,
            "nickname": nickname,
            "playerCounter": playerCounter,
            "compCounter": compCounter,
            "drawCounter": drawCounter,
        }), 200