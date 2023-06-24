import React from 'react';
import {
  Routes, Route, BrowserRouter,
} from 'react-router-dom';
import { AppProvider } from './AppContext';
import ListCommitsContainer from './components/ListCommitsContainer';
import AddRepoContainer from './components/AddRepoContainer';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <div id="wrapper" className="toggled">
          <Sidebar />
          <BrowserRouter>
            <AddRepoContainer />
            <Routes>
              <Route path="/" element={<ListCommitsContainer />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
