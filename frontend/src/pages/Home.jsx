import {Link} from 'react-router-dom'
import ticTacToeImage from "../assets/tic-tac-toe.png"
import { useState, useEffect} from 'react'


const Home = () => {
	const [nickname, setNickname] = useState("")

	const handleEnterGame = () => {
		fetch("http://localhost:8000/game", {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({nickname: nickname})
		})
		.then(response => response.json())
		.then(data => {
		  setNickname(data.nickname)
		})
		.catch(error => console.error('Error:', error));
	  };



    return (
			<div className="flex place-items-center flex-col absolute left-0 top-0 w-[100%] h-[100%]">
				<img src={ticTacToeImage} className="scale-50" />
				<div className="grid place-content-center w-[50%] h-[100%]">
					<input
						type="text"
						className="font-mono p-5 h-14 rounded-md w-58"
						placeholder="Nickname"
						name="nickname"
						id=""
						value={nickname} 
						onChange={e => setNickname(e.target.value)}
					/>
					<Link
						to="/game"
						onClick={handleEnterGame}
						className=" after:animate-pulse after:rounded-full relative after:content-[''] after:w-5 after:h-5 after:bg-white after:absolute after:top-[-10%] after:right-[-5%]  font-mono transition-all duration-150 grid w-32 h-14 mt-10 text-left text-white rounded-lg place-content-center text-bold hover:bg-transparent/90 bg-transparent/25"
					>
						Enter game
					</Link>
				</div>
			</div>
		);
}
export default Home