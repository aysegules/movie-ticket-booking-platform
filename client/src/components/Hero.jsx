import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon } from "lucide-react";

const Hero = () => {
  const heroMovie = {
    logo: assets.marvelLogo,
    name: "Guardians of the Galaxy",
    genres: ["Action", "Adventure", "Sci-Fi"],
    year: "2018",
    time: "2h 8m",
    description:
      "In a post-apocalyptic world where cities ride on wheels and consume each other to survive, two people meet in London and try to stop a conspiracy.",
  };

  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url(/backgroundImage.png)] bg-cover bg-center h-screen">
      <img
        src={heroMovie.logo}
        alt="Marvel"
        className="max-h-11 lg:h-11 mt-20"
      />
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-110">
        {heroMovie.name}
        {/* Guardians <br /> of the Galaxy */}
      </h1>

      <div className="flex items-center gap-4 text-gray-300">
        <span>{heroMovie.genres.join(" | ")}</span>

        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" />
          {heroMovie.year}
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" />
          {heroMovie.time}
        </div>
      </div>
      <p className="max-w-md text-gray-300">{heroMovie.description}</p>

      <button
        className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        onClick={() => {
          navigate("/movies");
        }}
      >
        Explore Movies
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Hero;
