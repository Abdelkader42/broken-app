/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const results = heavyCalculation(data);
  postMessage(results);
});

function heavyCalculation(data: number[]): Array<{id: number, value: number}> {
  return data.map((n, id) => {
    let value = n;
    for (let i = 1; i < 1000000; i++) {
      value = Math.sqrt(value * i);
    }
    return { id, value: Math.round(value) };
  });
}