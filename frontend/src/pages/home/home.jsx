import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div id='home'>
      <h1>Home Page</h1>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
};

export default Home;
