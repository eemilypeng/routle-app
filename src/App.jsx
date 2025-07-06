import React, { useEffect, useState } from "react";
import { parseGTFS } from "./utils/gtfsParser";

export default function App() {
  const [routes, setRoutes] = useState([]);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    async function loadRoutes() {
      const data = await parseGTFS();
      setRoutes(data);
      const daily = data[Math.floor(Math.random() * data.length)];
      setAnswer(daily);
    }
    loadRoutes();
  }, []);

  function handleGuess() {
    const found = routes.find(r => r.short_name === guess);
    if (!found) {
      setFeedback("Route not found.");
    } else if (found.route_id === answer.route_id) {
      setFeedback("🎉 Correct!");
    } else {
      setFeedback("❌ Incorrect. Try again.");
    }
    setGuess("");
  }

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🚍 Transitle</h1>
      <p>Guess the route of the day</p>
      <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Enter route short name" />
      <button onClick={handleGuess}>Guess</button>
      <p>{feedback}</p>
    </div>
  );
}