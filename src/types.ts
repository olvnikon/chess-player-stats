type GameResult =
  | 'win'
  | 'checkmated'
  | 'resigned'
  | 'insufficient'
  | 'stalemate'
  | 'timeout';

type PlayerResult = {
  result: GameResult;
  username: string;
};

type GameStats = {
  url: string;
  rated: boolean;
  end_time: number;
  time_class: 'rapid' | 'blitz';
  white: PlayerResult;
  black: PlayerResult;
};

export type GamesResponse = {
  games: GameStats[];
};
