import React from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Experiences from '../components/Experiences';
import Projects from '../components/Projects';
import Music from '../components/Music';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <About />
      <Experiences />
      <Projects />
      <Music />
      <Contact />
    </div>
  );
};

export default Home;