import { useState, useEffect } from 'react';
import { GamesResponse } from './types';

const WINS_PER_DAY = 2;
const startYear = 2023;
const startMonth = 11;
const fromDay = 16;

export function PlayerStats({ user }: { user: string }) {
  const [gamesStats, setGameStats] = useState<Record<string, number>>({});
  const [totalWins, setTotalWins] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const startDate = new Date(startYear, startMonth, fromDay);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let wins = 0;
    let _totalDays = 0;
    const initialStats: Record<string, number> = {};

    for (
      let d = new Date(startDate);
      d <= currentDate;
      d.setDate(d.getDate() + 1)
    ) {
      const isCurrentMonth = d.getMonth() === currentMonth;
      const dateKey = new Intl.DateTimeFormat(
        'pl-PL',
        !isCurrentMonth ? { month: 'long' } : undefined
      ).format(d);
      initialStats[dateKey] = 0;
      _totalDays++;
    }

    const fetchAndProcessGames = async (year: number, month: number) => {
      const response = await fetch(
        `https://api.chess.com/pub/player/${user.toLocaleLowerCase()}/games/${year}/${(
          month + 1
        )
          .toString()
          .padStart(2, '0')}`
      );
      const data: GamesResponse = await response.json();

      const userGames = data.games.filter(
        ({ white, black, time_class, end_time }) =>
          time_class === 'rapid' &&
          ((white.username === user && white.result === 'win') ||
            (black.username === user && black.result === 'win')) &&
          new Date(end_time * 1000) >= startDate
      );

      const isCurrentMonth = month === currentMonth;
      userGames.forEach((game) => {
        const dateKey = new Intl.DateTimeFormat(
          'pl-PL',
          !isCurrentMonth ? { month: 'long' } : undefined
        ).format(new Date(game.end_time * 1000));
        initialStats[dateKey]++;
        wins++;
      });
    };

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

      setGameStats(initialStats);
      setTotalWins(wins);
      setTotalDays(_totalDays);
    };

    processMonths();
  }, []);

  const expectedWins = totalDays * WINS_PER_DAY;
  const debt = expectedWins - totalWins;

  return (
    <div>
      <h2>User: {user}</h2>
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
        .map((key) => {
          const isDate = key.match(/^\d+/);
          const dayColor = !isDate
            ? 'black'
            : gamesStats[key] >= WINS_PER_DAY
            ? 'green'
            : gamesStats[key] === 0
            ? 'red'
            : 'orange';
          return (
            <div key={key}>
              {key}:{' '}
              <strong
                style={{
                  color: dayColor,
                }}
              >
                {gamesStats[key]}
              </strong>
            </div>
          );
        })}
    </div>
  );
}
