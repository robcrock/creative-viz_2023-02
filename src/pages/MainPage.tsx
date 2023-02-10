import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SimpleForceGraph from '../components/ForceGraph/SimpleForceGraph';

const MainPage = () => {
  const fetchData = async (path: string) => {
    const result = async () => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    };
    return result();
  };

  // const query = useQuery(['links'], () => fetchData('/data/links.json'));
  const query = useQuery(['network'], () => fetchData('/data/network.json'));

  const data = query.data;

  if (query.isLoading) return <p>Loading...</p>;

  if (query.isError) {
    return (
      <>
        <p>Error: {query.error}</p>
      </>
    );
  }

  return <SimpleForceGraph data={data} />;
};

export default MainPage;
