

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";

import Game from "./pages/Game";
import Home from "./pages/Home";
import './App.css'


const App = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/">
				<Route index element={<Home />} />
				<Route path="game" element={<Game />} />
			</Route>
		</>,
	),
);

export default App
