import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../AppContext';

export default function AddRepoContainer() {
  const {
    username,
    addRepo,
    addRepoMessage,
    setShowAlert,
    showAlert,
    showLoader,
    alertType,
  } = useContext(AppContext);
  const [repository, setRepository] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  useEffect(() => {
    (() => {
      if (repository.length === 0) {
        setDisableButton(true);
      } else {
        setDisableButton(false);
      }
    })();
  }, [repository]);

  const handleChange = (e) => {
    setRepository(e.target.value.slice(username.length + 1));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setDisableButton(true);
    addRepo({
      name: repository,
      owner: username,
    });
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setRepository('');
  };

  const handleInputClicked = () => {
    if (showAlert) {
      handleAlertClose();
    }
  };

  return (
    <div className="container">
      <div className="pt-4 pb-0 pl-4 pr-4">
        <form>
          <div className="form-row">
            <div className="col-sm-9">
              <div className="form-group" onClick={handleInputClicked}>
                <input
                  name="name"
                  placeholder="Enter the repository name"
                  className="form-control"
                  type="text"
                  value={`${username}/${repository}`}
                  onChange={handleChange}
                  disabled={showAlert}
                />
              </div>
            </div>
            <div className="col-sm-3">
              <button className="btn btn-primary btn-block" type="button" disabled={disableButton} onClick={onSubmit}>
                Add Repository
              </button>
            </div>
          </div>
        </form>

        {showAlert && (
          <div className={`alert alert-${alertType} alert-dismissible fade show`}>
            {addRepoMessage}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={handleAlertClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        {showLoader && <div>Waiting for response...</div>}
      </div>
    </div>
  );
}
