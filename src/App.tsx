import { useState, useEffect } from 'react';
import { GamesResponse } from './types';

const userToTrack = 'DiomaNik';
const WINS_PER_DAY = 2;
const startYear = 2023;
const startMonth = 11; // December (0 indexed)
const fromDay = 16;

function App() {
  const [gamesStats, setGameStats] = useState<Record<string, number>>({});
  const [totalWins, setTotalWins] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const startDate = new Date(startYear, startMonth, fromDay);
    const currentDate = new Date();
    let wins = 0;
    const initialStats: Record<string, number> = {};

    // Initialize stats with all days in the range set to 0 wins
    for (
      let d = new Date(startDate);
      d <= currentDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = new Intl.DateTimeFormat('pl-PL').format(d);
      initialStats[dateKey] = 0;
    }

    // Function to fetch and process games for a specific month
    const fetchAndProcessGames = async (year: number, month: number) => {
      const response = await fetch(
        `https://api.chess.com/pub/player/diomanik/games/${year}/${month + 1}`
      );
      const data: GamesResponse = await response.json();

      const userGames = data.games.filter(
        ({ white, black, time_class, end_time }) =>
          time_class === 'rapid' &&
          ((white.username === userToTrack && white.result === 'win') ||
            (black.username === userToTrack && black.result === 'win')) &&
          new Date(end_time * 1000) >= startDate
      );

      // Count wins for each day
      userGames.forEach((game) => {
        const dateKey = new Intl.DateTimeFormat('pl-PL').format(
          new Date(game.end_time * 1000)
        );
        initialStats[dateKey]++;
        wins++;
      });
    };

    // Loop through each month in the range and fetch games
    const processMonths = async () => {
      for (
        let year = startDate.getFullYear();
        year <= currentDate.getFullYear();
        year++
      ) {
        const startM =
          year === startDate.getFullYear() ? startDate.getMonth() : 0;
        const endM =
          year === currentDate.getFullYear() ? currentDate.getMonth() : 11;
        for (let month = startM; month <= endM; month++) {
          await fetchAndProcessGames(year, month);
        }
      }

      // Update state after processing all months
      setGameStats(initialStats);
      setTotalWins(wins);
      setTotalDays(Object.keys(initialStats).length);
    };

    processMonths();
  }, []);

  const expectedWins = totalDays * WINS_PER_DAY;
  const debt = expectedWins - totalWins;

  return (
    <div>
      <h2>User: {userToTrack}</h2>
      <h3>
        {totalWins} / {expectedWins}
      </h3>
      {debt <= 0 ? (
        <h4 style={{ color: 'greed' }}>You are {debt} games ahead</h4>
      ) : (
        <h4 style={{ color: 'red' }}>You are {debt} games behind</h4>
      )}
      {Object.keys(gamesStats)
        .toReversed()
        .map((day) => (
          <div key={day}>
            {day}:{' '}
            <strong
              style={{
                color: gamesStats[day] >= WINS_PER_DAY ? 'green' : 'red',
              }}
            >
              {gamesStats[day]}
            </strong>
          </div>
        ))}
    </div>
  );
}

export default App;
