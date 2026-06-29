import { useAuth } from "../../context/AuthContext";
import { LandingPage } from "./LandingPage";
import { FeedPage } from "./FeedPage";

const Home = () => {
  const { user } = useAuth();
  return user ? <FeedPage /> : <LandingPage />;
};

export default Home;
export { Home };
