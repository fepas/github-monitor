import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';

function Pagination() {
  const {
    pageNumber, setPageNumber, commitsData, fetchCommits,
  } = useContext(AppContext);

  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    (() => {
      setHasPrev(pageNumber > 1);
      setHasNext(pageNumber < Math.ceil(commitsData.count / 10) && pageNumber >= 1);
    })();
  }, [pageNumber]);

  useEffect(() => {
    (() => {
      fetchCommits();
    })();
  }, [pageNumber]);

  const handleClickPrev = (e) => {
    e.preventDefault();
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleClickNext = (e) => {
    e.preventDefault();
    if (pageNumber < Math.ceil(commitsData.count / 10)) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <nav aria-label="Page navigation">
      <div className="mx-2 d-flex justify-content-around align-items-center">
        <p>
          Page
          {' '}
          {pageNumber}
          {' '}
          of
          {' '}
          {Math.ceil(commitsData.count / 10)}
        </p>
        <ul className="pagination mx-2">
          <li className={`page-item ${hasPrev ? '' : 'disabled'}`} onClick={handleClickPrev}>
            <a className="page-link" href="#" {...(hasPrev ? {} : { tabIndex: '-1', 'aria-disabled': 'true' })}>Previous</a>
          </li>
          <li className={`page-item ${hasNext ? '' : 'disabled'}`} onClick={handleClickNext}>
            <a className="page-link" href="#" {...(hasNext ? {} : { tabIndex: '-1', 'aria-disabled': 'true' })}>Next</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Pagination;
