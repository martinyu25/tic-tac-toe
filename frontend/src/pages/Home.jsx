import {Link, Form} from 'react-router-dom'
import ticTacToeImage from "../assets/tic-tac-toe.png"
import { useState, useEffect} from 'react'


const Home = () => {
	const [nickname, setNickname] = useState("")
	const [turnsComp, setTurnsComp] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [turnsPlayer, setTurnsPlayer] = useState(Array(3).fill().map(() => Array(3).fill(0)));
	const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill(0)));
    const [turn, setTurn] = useState(-1)
    const [compCounter, setCompCounter] = useState(0)
    const [playerCounter, setPlayerCounter] = useState(0)
    const [drawCounter, setDrawCounter] = useState(0)
	const handleEnterGame = (e) => {

		if (!nickname) {
			e.preventDefault();
			alert('Please enter a nickname');
		}
		else if(nickname.length > 10)
		{
			e.preventDefault();
			alert('Please enter a shorter nickname');
		} 
		else 
		{
			// Continue with the game entering logic
			
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({enterGame:true, nickname: nickname, turnsComp: turnsComp, turnsPlayer: turnsPlayer, turn: turn, board: board, compCounter: compCounter, playerCounter:playerCounter, drawCounter})
			})
			.then(response => response.json())
			.then(data => {
				setNickname(data.nickname)
				
			})
			.catch(error => console.error('Error:', error));
		};
	}

	const handleLoadGame = (e) => {

		if (!nickname) {
			e.preventDefault();
			alert('Please enter a nickname');
		  } else {
			
			fetch("http://localhost:8000/game", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({"nickname":nickname, "loadGame":true,})
			})
			.then(response => response.json())
			.then(data => {
				setNickname(data.nickname)
			})
			.catch(error => console.error('Error:', error));
		};
	}
	



    return (
			<div className="flex place-items-center flex-col absolute left-0 top-0 w-[100%] h-[100%]">
				<img src={ticTacToeImage} className="scale-50" />
				<Form className="grid place-content-center w-[50%] h-[100%]">
					<input
						type="text"
						className="font-mono p-5 h-14 rounded-md w-58"
						placeholder="Nickname"
						name="nickname"
						id=""
						value={nickname} 
						onChange={e => setNickname(e.target.value)}
						required
					/>
					<Link
						to="/game"
						onClick={handleEnterGame}
						className=" after:animate-pulse after:rounded-full relative after:content-[''] after:w-5 after:h-5 after:bg-red-600 after:absolute after:top-[-10%] after:right-[-5%]  font-mono transition-all duration-150 grid w-32 h-14 mt-10 text-left text-white rounded-lg place-content-center text-bold hover:bg-transparent/90 bg-transparent/25"
					>
						New game
					</Link>
					<Link
						to="/game"
						onClick={handleLoadGame}
						className=" font-mono transition-all duration-150 grid w-32 h-14 mt-10 text-left text-white rounded-lg place-content-center text-bold hover:bg-transparent/90 bg-transparent/25"
					>
						Load game
					</Link>
				</Form>
			</div>
		);
}
export default Home