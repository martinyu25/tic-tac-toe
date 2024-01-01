import random
import sys
import json
import pickle
from flask import Blueprint, jsonify, request

views = Blueprint(__name__, 'views')

nickname = ""  # Global variable to store the nickname



def newBoard():
    """
    Генерира нова дъска (празен двумерен лист от нули).
    """
    return [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


def saveGame(filename, data):
    """
    Saves the provided data into a file.
    """
    try:
        with open(filename + ".txt", "w") as file:
            json.dump(data, file)
    except Exception as e:
        print(f"Couldn't save the data. Exiting now. Error: {e}")
        sys.exit()

# def loadGame(filename):
#     """
#     Зарежда запаметена игра от файл.
#     """
#     try:
#         with open(filename + ".txt", "rb") as file:
#             return json.load(file)
#     except FileNotFoundError:
#         print("File with that name hasn't been found!")
#         sys.exit()

# def printBoard(board):
#     """
#     Печата форматираната дъска.
#     """
#     for row in board:
#         print("|" + "|".join([" " if cell == 0 else "O" if cell == 1 else "X" for cell in row]) + "|")
#     print()

def validMove(row, column, board):
    """
    Проверява валидността на позиция.
    """
    return 0 <= row < 3 and 0 <= column < 3 and board[row][column] == 0

# def makeMove(row, column, board):
#     """
#     Извършва ход на човешкия играч.
#     """
#     board[row][column] = -1
#     return board

def checkWinnerV(turn, board):
    """
    Проверява дали играчът има три последователни марки вертикално.
    """
    for col in range(3):
        if all(board[row][col] == turn for row in range(3)):
            return True
    return False

def checkWinnerH(turn, board):
    """
    Проверява дали играчът има три последователни марки хоризонтално.
    """
    for row in range(3):
        if all(board[row][col] == turn for col in range(3)):
            return True
    return False

def checkWinnerD(turn, board):
    """
    Проверява дали играчът има три последователни марки диагонално.
    """
    return all(board[i][i] == turn for i in range(3)) or all(board[i][2 - i] == turn for i in range(3))

def checkWinner(turn, board):
    """
    Проверява дали играчът има три последователни марки по който и да е начин.
    """
    return checkWinnerH(turn, board) or checkWinnerV(turn, board) or checkWinnerD(turn, board)

def computerMove(board):
    """
    Ход на компютърния играч.
    """
    print("Computer is thinking...")
    while True:
        row, col = random.randint(0, 2), random.randint(0, 2)
        if validMove(row, col, board):
            return row, col

def checkFull(board):
    """
    Проверява дали дъската е запълнена.
    """
    return all(cell != 0 for row in board for cell in row)






@views.route("/game", methods=["GET", "POST"])
def game():
    global nickname
    if request.method == "POST":
        # Handle the POST request here
        data = request.get_json()
        nickname = data.get("nickname", "")
        board = newBoard()  # Create a new game board
        saveGame(nickname, data)  # Save the game
        return jsonify({
            "nickname": nickname,
            "board": board,
        }), 200

    else:
        # data = loadGame(nickname)
        return jsonify({
            "board": [[0]*3 for _ in range(3)],
            "turns": [[0]*3 for _ in range(3)],
            "turn": -1,
            "nickname": nickname,
        }), 200