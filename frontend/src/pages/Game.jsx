import {Link} from 'react-router-dom'
import { useState, useEffect} from 'react'
import logoX from "../assets/close.png"
import logoO from '../assets/circle.png'

const Game = () => {
	const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [turnsPlayer, setTurnsPlayer] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [turnsComp, setTurnsComp] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [turn, setTurn] = useState(0)
    const [nickname, setNickname] = useState("")
	const [compCounter, setCompCounter] = useState(0)
    const [playerCounter, setPlayerCounter] = useState(0)


	const handleNewGame = async () => {
			
			// Continue with the game entering logic
			setTurnsPlayer(Array(3).fill().map(() => Array(3).fill(0)))
			setTurnsComp(Array(3).fill().map(() => Array(3).fill(0)))
			setBoard(Array(3).fill().map(() => Array(3).fill(0)))
			setTurn(-1)
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({newGame:true, turnsComp: turnsComp, turnsPlayer: turnsPlayer, turn: turn, board: board})
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
				})
				.catch(error => console.error('Error:', error));
		}, [nickname]);

		const checkWinnerH =  () => {
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({checkH:true, turn:turn, turnsPlayer:turnsPlayer, turnsComp:turnsComp})
			})
			.then(response => response.json())
			.then(async (data) => {
				console.log(data.player)
				console.log(data.computer)
				if(data.player)
				{
					await new Promise((resolve) => setTimeout(resolve, 1000));
					setPlayerCounter(playerCounter + 1)
					handleNewGame()
				}
				else if(data.computer)
				{
					await new Promise((resolve) => setTimeout(resolve, 1000));
					setCompCounter(compCounter + 1)
					handleNewGame()
				}
			})
		}

	const handleSaveGame = () => {
		fetch("http://localhost:8000/game", {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({saveGame: true, nickname: nickname, turnsComp: turnsComp, turnsPlayer: turnsPlayer, turn: turn, board: board, compCounter: compCounter, playerCounter: playerCounter})
		})
		.catch(error => console.error('Error:', error));
	  };



    return (
			<main className="h-full w-full">
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
										onClick={() => {

											
											const newArray = [...board];
											const newArrayTurnsPlayer = [...turnsPlayer];
											const newArrayTurnsComp = [...turnsComp];
											
											turn == -1 ? setTurn(2) : setTurn(-1);
											
											if(turn == -1)
											{
												newArray[rowIndex][colIndex] = turn;
												setBoard(newArray);
												newArrayTurnsPlayer[rowIndex][colIndex] = turn;
												setTurnsPlayer(newArrayTurnsPlayer);
											}
											else
											{
												newArray[rowIndex][colIndex] = turn;
												setBoard(newArray);
												newArrayTurnsComp[rowIndex][colIndex] = turn;
												setTurnsComp(newArrayTurnsComp);
											}
											
											checkWinnerH()
											console.table(board);
											console.table(turnsPlayer);
											console.table(turnsComp);
										}}
										className={`${
											colIndex == 0 || colIndex == 1 ? `border-r-4` : ``
										}
										${
											rowIndex == 1 ? `border-t-4 border-b-4` : ``
										} bg-transparent w-28 h-28 grid place-items-center`}
										disabled={item}
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

					<div className="flex flex-row justify-between mt-10">
						<div className="flex flex-col">
							<h2 className="font-mono">{nickname}</h2>
							<h2 className="font-mono">{playerCounter}</h2>
						</div>
						<Link to="/" className='p-5 rounded-md' onClick={handleSaveGame} >Save and exit</Link>
						<div className="flex flex-col">
							<h2 className="font-mono">Computer</h2>
							<h2 className="font-mono">{compCounter}</h2>
						</div>
					</div>
				</div>
			</main>
		);
}
export default Game