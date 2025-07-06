export async function parseGTFS() {
  const response = await fetch("/gtfs/routes.txt");
  const text = await response.text();
  const lines = text.split("\n").slice(1);
  const routes = lines.map(line => {
    const [route_id, short_name, long_name] = line.split(",");
    return { route_id, short_name, long_name };
  }).filter(r => r.route_id);
  return routes;
}