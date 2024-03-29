import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/">
        <button>Return to Login</button>
      </Link>
      <Link to="/workspace">
        <button>Go to Workspace</button>
      </Link>
    </div>
  );
};

export default Home;
