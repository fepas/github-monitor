import React, { createContext, useState, useMemo } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { username } = document.getElementById('main').dataset;

  const [repositories, setRepositories] = useState([]);
  const [commitsData, setCommits] = useState([]);
  const [addRepoMessage, setaddRepoMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const [authorFilter, setAuthorFilter] = useState(false);
  const [repositoryFilter, setRepositoryFilter] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories/');
      if (!response.ok) {
        throw new Error('Falha ao obter repositórios');
      }
      const data = await response.json();
      setRepositories(data.results);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchCommits = async () => {
    let queryString = '';

    if (authorFilter) {
      queryString += `author=${authorFilter}&`;
    }

    if (repositoryFilter) {
      queryString += `repository__name=${repositoryFilter}&`;
    }

    if (pageNumber > 1) {
      queryString += `page=${pageNumber}&`;
    }

    if (queryString.endsWith('&')) {
      queryString = queryString.slice(0, -1);
    }

    try {
      const response = await fetch(`/api/commits/?${queryString}`);
      if (!response.ok) {
        throw new Error('Falha ao obter repositórios');
      }
      const data = await response.json();
      setCommits(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const addRepo = async (postData) => {
    try {
      const token = document.getElementById('main').dataset.csrftoken;
      setShowLoader(true);
      const response = await fetch('/api/repositories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': token,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      setShowLoader(false);

      if (!response.ok) {
        setAlertType('warning');
        setaddRepoMessage(data.non_field_errors[0]);
        setShowAlert(true);
        throw new Error(`Failed to create repository ${data.non_field_errors[0]}`);
      } else {
        setAlertType('success');
        setaddRepoMessage('Repository successfully added.');
        setShowAlert(true);
        fetchRepositories();
        fetchCommits();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const contextValue = useMemo(
    () => ({
      username,
      repositories,
      commitsData,
      fetchRepositories,
      fetchCommits,
      addRepo,
      addRepoMessage,
      showAlert,
      setShowAlert,
      showLoader,
      alertType,
      repositoryFilter,
      setRepositoryFilter,
      authorFilter,
      setAuthorFilter,
      pageNumber,
      setPageNumber,
    }),
    [
      username,
      repositories,
      commitsData,
      fetchRepositories,
      fetchCommits,
      addRepo,
      addRepoMessage,
      showAlert,
      setShowAlert,
      showLoader,
      alertType,
      repositoryFilter,
      setRepositoryFilter,
      authorFilter,
      setAuthorFilter,
      pageNumber,
      setPageNumber,
    ],
  );

  return (
    <AppContext.Provider
      value={contextValue}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
