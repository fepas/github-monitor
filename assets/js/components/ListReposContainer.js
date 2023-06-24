import React, { useContext, useEffect } from 'react';
import AppContext from '../AppContext';

export default function ListReposContainer() {
  const { repositories, fetchRepositories, setRepositoryFilter } = useContext(AppContext);

  useEffect(() => {
    (() => {
      fetchRepositories();
    })();
  }, []);

  return (
    <div>
      {repositories.map((repository, index) => (
        <h6
          type="button"
          onClick={() => { setRepositoryFilter(repository.name); }}
          key={index}
        >
          {repository.name}
        </h6>
      ))}
    </div>
  );
}
