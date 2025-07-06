let routes = [];
let shapes = {};
let answer = null;
let map, shapeLayer;

async function loadRoutes() {
  const res = await fetch("gtfs/routes.txt");
  const text = await res.text();
  const lines = text.trim().split("\n").slice(1);
  return lines.map(line => {
    const [route_id, short_name, long_name] = line.split(",");
    return { route_id, short_name, long_name };
  });
}

async function loadShapes() {
  const res = await fetch("gtfs/shapes.txt");
  const text = await res.text();
  const lines = text.trim().split("\n").slice(1);
  const shapeMap = {};
  for (const line of lines) {
    const [shape_id, lat, lon, seq] = line.split(",");
    if (!shapeMap[shape_id]) shapeMap[shape_id] = [];
    shapeMap[shape_id].push([parseFloat(lat), parseFloat(lon)]);
  }
  return shapeMap;
}

function showRouteOnMap(shapePoints) {
  if (shapeLayer) {
    map.removeLayer(shapeLayer);
  }
  shapeLayer = L.polyline(shapePoints, { color: 'blue' }).addTo(map);
  map.fitBounds(shapeLayer.getBounds());
}

function onGuess() {
  const input = document.getElementById("guessInput");
  const feedback = document.getElementById("feedback");
  const guess = input.value.trim();
  const found = routes.find(r => r.short_name === guess);
  if (!found) {
    feedback.textContent = "Route not found.";
  } else if (found.route_id === answer.route_id) {
    feedback.textContent = "🎉 Correct! You guessed the route!";
  } else {
    feedback.textContent = "❌ Incorrect. Try again.";
  }
  input.value = "";
  input.focus();
}

async function init() {
  routes = await loadRoutes();
  shapes = await loadShapes();
  answer = routes[Math.floor(Math.random() * routes.length)];
  console.log("Answer:", answer);

  map = L.map("map").setView([33.77, -118.19], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const shape = shapes[answer.route_id];
  if (shape) showRouteOnMap(shape);
}

document.getElementById("guessBtn").addEventListener("click", onGuess);
document.getElementById("guessInput").addEventListener("keydown", e => {
  if (e.key === "Enter") onGuess();
});

init();