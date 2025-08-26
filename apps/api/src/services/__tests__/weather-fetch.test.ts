import { expect, test } from "bun:test";

test("can fetch from OpenWeatherMap API", async () => {
  const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=London&appid=test");
  
  // 200 if valid key, 401 if invalid - either confirms API is reachable
  expect([200, 401]).toContain(response.status);
});