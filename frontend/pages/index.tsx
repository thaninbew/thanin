import React from 'react';
import Overlay from '../components/Overlay';
import About from '../components/About';
import Experiences from '../components/Experiences';
import Projects from '../components/Projects';
import Music from '../components/Music';
import Contact from '../components/Contact';
import BackgroundLayers from '../components/Background';

const Home: React.FC = () => {
  return (
    <div>
      <BackgroundLayers />
      {/* Overlay */}
      <Overlay />

    </div>
  );
};

export default Home;
