import { Link } from "react-router-dom";
import bannerImg from "./../../assets/images/banner.jpg";
import Banner from "../blocks/Banner";
import GetFromWordpress from "../blocks/GetFromWordpress";
import GetGame from "../blocks/GetGame";

const Home = () => {
  return (
    <>
      <Banner img={bannerImg} />
      <GetFromWordpress />
      <GetGame />
    </>
  );
};

export default Home;
