x// Load routes from CSV file
async function loadRoutes() {
    const res = await fetch('routes.txt');
    const text = await res.text();
    const lines = text.trim().split('\n').slice(1);
    return lines.map(line => {
      const [route_id, short_name, long_name] = line.split(',');
      return { route_id, short_name, long_name };
    });
  }
  
  let routes = [];
  let answer = null;
  
  async function init() {
    routes = await loadRoutes();
    // Pick a random route as the answer
    answer = routes[Math.floor(Math.random() * routes.length)];
    console.log('Route of the day:', answer); // For debugging
  }
  
  function onGuess() {
    const input = document.getElementById('guessInput');
    const feedback = document.getElementById('feedback');
    const guess = input.value.trim();
    const found = routes.find(r => r.short_name === guess);
    if (!found) {
      feedback.textContent = 'Route not found.';
    } else if (found.route_id === answer.route_id) {
      feedback.textContent = '🎉 Correct! You guessed the route!';
    } else {
      feedback.textContent = '❌ Incorrect. Try again.';
    }
    input.value = '';
    input.focus();
  }
  
  document.getElementById('guessBtn').addEventListener('click', onGuess);
  document.getElementById('guessInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') onGuess();
  });
  
  init();
  