
import { useState, useEffect} from 'react'
import logoX from "../assets/close.png"
import logoO from '../assets/circle.png'

const Game = () => {

	const [gameBoard, setGameBoard] = useState(Array(3).fill().map(() => Array(3).fill(null)));
	const [turns, setTurns] = useState(Array(3).fill().map(() => Array(3).fill(null)));
    const [turn, setTurn] = useState(0)
    const [nickname, setNickname] = useState("")
	useEffect(() => {
		fetch("http://localhost:8000/game")
			.then(response => response.json())
			.then(data => {
				setGameBoard(data.board)
				setTurns(data.turns)
				setTurn(data.turn)
				setNickname(data.nickname)
			})
			.catch(error => console.error('Error:', error));
	}, [nickname]);

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
						{gameBoard.map((row, rowIndex) => {
							return row.map((item, colIndex) => {
								return (
									<button
										key={`${rowIndex}-${colIndex}`}
										onClick={() => {
											const newArray = [...gameBoard];
											newArray[rowIndex][colIndex] = 1;
											setGameBoard(newArray);

											turn == -1 ? setTurn(2) : setTurn(-1);

											const newArrayTurns = [...turns];
											newArrayTurns[rowIndex][colIndex] = turn;
											setTurns(newArrayTurns);

											console.table(gameBoard);
										}}
										className={`${
											colIndex == 0 || colIndex == 1 ? `border-r-4` : ``
										}
										${
											rowIndex == 1 ? `border-t-4 border-b-4` : ``
										} bg-transparent w-28 h-28 grid place-items-center`}
										disabled={item}
									>
										{gameBoard[rowIndex][colIndex] ? (
											turns[rowIndex][colIndex] == -1 ? (
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
							<h2 className="font-mono">0</h2>
						</div>
						<div className="flex flex-col">
							<h2 className="font-mono">Computer</h2>
							<h2 className="font-mono">0</h2>
						</div>
					</div>
				</div>
			</main>
		);
}
export default Game