import React, { useContext, useLayoutEffect, useState } from 'react';
import AppContext from '../AppContext';
import ListReposContainer from './ListReposContainer';

export default function Sidebar() {
  const { username } = useContext(AppContext);

  const [profilePicture, setProfilePicture] = useState('');

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      const profilePictureUrl = data.avatar_url;
      setProfilePicture(profilePictureUrl);
      return profilePictureUrl;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      return null;
    }
  };

  useLayoutEffect(() => {
    (async () => {
      await fetchProfilePicture(username);
    })();
  }, []);

  return (
    <div id="sidebar-wrapper">
      <ul className="sidebar-nav">
        <li className="sidebar-brand text-white">
          <div className="d-flex flex-row justify-content-around">
            <span className="col col-auto">Github Monitor</span>
            <div className="d-flex justify-content-center align-items-center col col-lg-2">
              {profilePicture && (
                <img
                  className="img-profile"
                  style={{
                    width: '30px',
                    borderRadius: '35px',
                  }}
                  src={profilePicture}
                  alt="profile"
                />
              )}
            </div>
          </div>
        </li>
        <li className="sidebar-brand text-white">
          <ListReposContainer />
        </li>
      </ul>
    </div>
  );
}
