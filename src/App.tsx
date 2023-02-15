import { useQuery } from '@tanstack/react-query';
import ForceGraph from './components/ForceGraph/ForceGraph';

function App() {
  const fetchData = async (path: `/data/${string}.json`) => {
    const result = async () => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response was not successful');
      }
      const json = await response.json();
      return json;
    };
    return await result();
  };

  const query = useQuery(['network'], () => fetchData('/data/network.json'));

  const data = query.data;

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (query.isError) {
    return <p>There was an error in your query</p>;
  }

  return (
    <div className="App">
      <ForceGraph data={data} />
    </div>
  );
}

export default App;
