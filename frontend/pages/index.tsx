import React from 'react';
import Overlay from '../components/Overlay';
import About from '../components/About';
import Experiences from '../components/Experiences';
import Projects from '../components/Projects';
import Music from '../components/Music';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div>
      {/* Overlay */}
      <Overlay />

      {/* Main Content */}
        <About />
        <Experiences />
        <Projects />
        <Music />
        <Contact />
    </div>
  );
};

export default Home;
