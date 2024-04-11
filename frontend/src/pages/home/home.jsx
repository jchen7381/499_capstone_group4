import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div id='home'>
      <h1>Home Page</h1>
      <Link to="/login">
        <button>Return to Login</button>
      </Link>
      <Link to="/workspace">
        <button>Go to Workspace</button>
      </Link>
    </div>
  );
};

export default Home;
