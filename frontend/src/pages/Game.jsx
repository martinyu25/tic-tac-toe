import {Link} from 'react-router-dom'
import { useState, useEffect} from 'react'
import logoX from "../assets/close.png"
import logoO from '../assets/circle.png'

const Game = () => {
	const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [turnsPlayer, setTurnsPlayer] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [turnsComp, setTurnsComp] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [turn, setTurn] = useState(-1)
    const [nickname, setNickname] = useState("")
	const [compCounter, setCompCounter] = useState(0)
    const [playerCounter, setPlayerCounter] = useState(0)
    const [drawCounter, setDrawCounter] = useState(0)
	
	
	const handleNewGame = (playerCounter, compCounter, drawCounter) => {
		
		// Continue with the game entering logic
			const newBoard = [[0,0,0],[0,0,0],[0,0,0]];
			const newTurnsPlayer = [[0,0,0],[0,0,0],[0,0,0]];
			const newTurnsComp = [[0,0,0],[0,0,0],[0,0,0]];
			const newTurn = -1;

			setBoard(newBoard);
			setTurnsPlayer(newTurnsPlayer);
			setTurnsComp(newTurnsComp);
			setTurn(newTurn);
			
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({newGame:true, turnsComp: newTurnsComp, turnsPlayer: newTurnsPlayer, turn: newTurn, board: newBoard, playerCounter: playerCounter, compCounter: compCounter, drawCounter: drawCounter})
			})
			.then(response => response.json())
			.then(data => {
				// setNickname(data.nickname)
				
			})
			.catch(error => console.error('Error:', error));
		
	}

	
		useEffect(() => {
			fetch("http://localhost:8000/game")
				.then(response => response.json())
				.then(data => {
					setBoard(data.board)
					setTurnsComp(data.turnsComp)
					setTurnsPlayer(data.turnsPlayer)
					setTurn(data.turn)
					setNickname(data.nickname)
					setCompCounter(data.compCounter)
					setPlayerCounter(data.playerCounter)
					setDrawCounter(data.drawCounter)
					
				})
				.catch(error => console.error('Error:', error));
		}, [nickname]);

		const checkWinner =  () => {
			console.table(turnsPlayer)
			console.table(board)
			console.table(turnsComp)
			return fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({check:true, turn:turn, turnsPlayer:turnsPlayer, turnsComp:turnsComp, board:board, playerCounter:playerCounter, compCounter:compCounter, drawCounter:drawCounter})
			})
			.then(response => response.json())
			.then(async (data) => {
				
				if(data.player)
				{
					setPlayerCounter(playerCounter + 1)
					handleNewGame(playerCounter + 1, compCounter, drawCounter)
					console.log("player win")
					return 1
				}
				else if(data.computer)
				{
					setCompCounter(compCounter + 1)
					handleNewGame(playerCounter, compCounter + 1, drawCounter)
					console.log("computer win")
					return 2

					
				}
				else if(data.full)
				{
					setDrawCounter(drawCounter + 1)
					handleNewGame(playerCounter, compCounter, drawCounter + 1)
					console.log("draw")
					return 1
					
				}
				else{
					return 0
				}
			})
		}

		useEffect(() => {
			const fetchWinner = async () => {
				const winner = await checkWinner();
				console.log("checkwinner" + winner)
			};
			fetchWinner();
		}, [turnsComp]); 

		const computerMove = async () => {
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({computerMove:true, turn:-1, turnsPlayer:turnsPlayer, turnsComp:turnsComp, board:board})
			})
			.then(response => response.json())
			.then(async (data) => {
					const winner = await checkWinner();
					console.log("checkwinner" + winner)
					if(winner == 0)
					{

						console.log("computer move")
						setBoard(data.computerMove[0])
						setTurnsPlayer(data.computerMove[1])
						setTurnsComp(data.computerMove[2])
						setTurn(data.turn) 
					}

			})
			.catch(error => console.error('Error:', error));
		}


		

	const handleSaveGame = () => {
		fetch("http://localhost:8000/game", {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({drawCounter:drawCounter, saveGame: true, nickname: nickname, turnsComp: turnsComp, turnsPlayer: turnsPlayer, turn: turn, board: board, compCounter: compCounter, playerCounter: playerCounter})
		})
		.catch(error => console.error('Error:', error));
	  };



    return (
			<main className="h-full w-full relative">
				<div className="inline-flex ">
					<img
						src={logoX}
						className="animate-bounce-fast w-20 h-20 m-5"
						alt="X"
					/>
					<img
						src={logoO}
						className="animate-bounce-slow w-20 h-20 m-5"
						alt="O"
					/>
				</div>
				<h1 className="font-mono mb-10">Tic Tac Toe</h1>
				<div className="">
					<div className="relative grid grid-cols-3 bg-transparent backdrop-blur-sm backdrop-filter bg-opacity-20 rounded-md">
						{board.map((row, rowIndex) => {
							return row.map((item, colIndex) => {
								return (
									<button
										key={`${rowIndex}-${colIndex}`}
										onClick={async () => {

											
											const newArray = [...board];
											const newArrayTurnsPlayer = [...turnsPlayer];
											const newArrayTurnsComp = [...turnsComp];
											
											turn == -1 ? setTurn(2) : setTurn(-1);
											console.log("turn" + turn)
											if(turn == -1)
											{
												newArray[rowIndex][colIndex] = turn;
												setBoard(newArray);
												newArrayTurnsPlayer[rowIndex][colIndex] = turn;
												setTurnsPlayer(newArrayTurnsPlayer);
											}
											
											computerMove()
										}}
										className={`${
											colIndex == 0 || colIndex == 1 ? `border-r-4` : ``
										}
										${
											
											rowIndex == 1 ? `border-t-4 border-b-4` : ``
										} bg-transparent w-28 h-28 grid place-items-center`}
										disabled={turn == 2 ? true : false || item != 0 ? true : false}
									>
										{board[rowIndex][colIndex] ? (
											board[rowIndex][colIndex] == -1 ? (
												<img
													src={logoX}
													className="animate-ping-once w-10 h-10 m-5 transition-all duration-100"
													alt="X"
												/>
											) : (
												<img
													src={logoO}
													className="animate-ping-once w-10 h-10 m-5 transition-all duration-100"
													alt="O"
												/>
											)
										) : null}
									</button>
								);
							});
						})}
					</div>

					<div className="relative flex flex-row justify-between mt-10 translate-x-1 place-items-center">
						<div className="flex flex-col">
							<h2 className="font-mono">{nickname}</h2>
							<h2 className="font-mono">{playerCounter}</h2>
						</div>
						<div className="flex flex-col">
							<h2 className="font-mono">Draw</h2>
							<h2 className="font-mono">{drawCounter}</h2>
						</div>
						<div className="flex flex-col">
							<h2 className="font-mono">Computer</h2>
							<h2 className="font-mono">{compCounter}</h2>
						</div>
						<Link to="/" className='p-5 absolute top-[150%] left-[28%] rounded-md bg-transparent/15 ' onClick={handleSaveGame} >Save and exit</Link>
					</div>
				</div>
			</main>
		);
}
export default Game