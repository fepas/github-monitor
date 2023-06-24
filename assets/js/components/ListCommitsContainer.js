import React, { useContext, useState, useEffect } from 'react';
import Pagination from './Pagination';
import AppContext from '../AppContext';

export default function ListCommitsContainer() {
  const [showFilters, setShowFilters] = useState(false);

  const {
    repositoryFilter,
    authorFilter,
    setRepositoryFilter,
    setAuthorFilter,
    fetchCommits,
    commitsData,
    setPageNumber,
  } = useContext(AppContext);

  const generateCommitLog = (commit) => {
    const date = new Date(commit.date);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    let log = `${commit.author} authored `;
    log += `on ${commit.repository} at ${formattedDate} ${formattedTime}`;

    return (
      <small className="text-muted">
        {log}
      </small>
    );
  };

  const formatCommitTitle = (fullMessage) => {
    const splittedCommitMessage = fullMessage.split('\n');
    const commitTitle = splittedCommitMessage[0];

    return (
      <h5 className="font-weight-bold">
        {' '}
        {commitTitle}
        {' '}
      </h5>
    );
  };

  const formatCommitMessage = (fullMessage) => {
    const splittedCommitMessage = fullMessage.split('\n');
    splittedCommitMessage.splice(0, 1);

    const formatedMessage = splittedCommitMessage.map((element, index) => <p className="h6" key={index}>{element}</p>);

    return (
      <div className="mt-2">
        {formatedMessage}
      </div>
    );
  };

  useEffect(() => {
    (() => {
      setShowFilters(repositoryFilter || authorFilter);
      fetchCommits();
      setPageNumber(1);
    })();
  }, [repositoryFilter,
    authorFilter]);

  return (
    <div className="container">
      <div className="p-4 pt-0">
        {(!(commitsData.results?.length > 0) && (authorFilter || repositoryFilter)) && (
        <div className="alert alert-warning" role="alert">
          The
          {repositoryFilter}
          {' '}
          repository has no commits in the last 30 days
        </div>
        )}
        {!(commitsData.results?.length > 0 && (authorFilter || repositoryFilter))
        && (<h5>Add a new repository or click on an existing one in the sidebar</h5>) }
        {commitsData.results?.length > 0 && (authorFilter || repositoryFilter) && (
        <div>
          <div>
            <h3>Commits List</h3>
            {showFilters && (
            <div className="card">
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">Filters (Click to remove)</h6>
                <div className="d-flex justify-content-start">
                  {authorFilter && (
                  <button type="button" className="btn btn-primary mx-3" onClick={() => { setAuthorFilter(false); }}>
                    Author:
                    {' '}
                    {authorFilter}
                    {' '}
                    <span className="badge badge-light" />
                  </button>
                  )}
                  {repositoryFilter && (
                  <button type="button" className="btn btn-primary mx-3" onClick={() => { setRepositoryFilter(false); }}>
                    Repository:
                    {' '}
                    {repositoryFilter}
                    {' '}
                    <span className="badge badge-light" />
                  </button>
                  )}
                </div>
              </div>
            </div>
            )}
            <div className="d-flex justify-content-center mt-3">
              <Pagination />
            </div>
          </div>
          <div className="card card-outline-secondary">
            <div className="card-body">
              {commitsData.results?.map((commit, index) => (
                <div key={commit.sha}>
                  <div className="d-flex justify-content-start align-items-center">
                    <div className="avatar" onClick={() => { setAuthorFilter(commit.author); }}>
                      <img alt={commit.author} className="img-author" src={commit.author_avatar} />
                    </div>
                    {formatCommitTitle(commit.message)}
                  </div>
                  <div>
                    <div className="commit-message">
                      {formatCommitMessage(commit.message)}
                    </div>
                    <div className="commit-details">
                      {generateCommitLog(commit)}
                      {index !== commitsData.results.length - 1 && <hr />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <Pagination />
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
