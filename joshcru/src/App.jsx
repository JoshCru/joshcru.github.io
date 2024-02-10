import Discord from './components/pages/Discord';
import RebalanceCalculator from './components/pages/RebalanceCalculator';
import ToDoList from './components/pages/ToDoList/ToDoList';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom';

import React from 'react';

const Home = () => {
  return <div>Home</div>;
};

const About = () => {
  return <div>About</div>;
};

const AboutTeam = () => {
  return <div>About Team</div>;
};

const AboutHistory = () => {
  return <div>About History</div>;
};

const Profile = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [name, setName] = React.useState('');
  console.log(params);
  if (!params.name) {
    return (
      <>
        Name: <input value={name} onChange={e => setName(e.target.value)}/>
        <button onClick={() => {
          navigate('/profile/' + name)
        }}>Go!</button>

      </>
    )
  }
  return (
    <div>
      Profile {params.name}
    </div>
  );
};

const Nav = () => {
  return (
    <>
      <span><Link to="/">Home</Link></span>&nbsp;|&nbsp;
      <span><Link to="/discord">Replicate Discord</Link></span>&nbsp;|&nbsp;
      <span><Link to="/rebalance">Rebalance Calculator</Link></span> &nbsp;|&nbsp;
      <span><Link to="/todolist">To Do List</Link></span>&nbsp;|&nbsp;
      <span><Link to="/about/history">History</Link></span>&nbsp;|&nbsp;
      <span><Link to="/profile">Profile</Link></span>
    </>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav/>
        <hr/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />}>
            <Route path="team" element={<AboutTeam />}/>
            <Route path="history" element={<AboutHistory />}/>
          </Route>
          <Route path="/discord" element={<Discord />} />
          <Route path="/rebalance" element={<RebalanceCalculator/>} />
          <Route path="/todolist" element={<ToDoList />} />
          <Route path="/profile/:name" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
