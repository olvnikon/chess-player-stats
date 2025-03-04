import { PlayerStats } from './PlayerStats';

const usersToTrack = ['DiomaNik', 'DiomaNikTurniej'];

function App() {
  window.location.href = 'market://details?id=com.ubs.neo';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(250px, 1fr))',
      }}
    >
      {usersToTrack.map((user) => (
        <PlayerStats key={user} user={user} />
      ))}
    </div>
  );
}

export default App;
