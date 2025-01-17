import React from 'react';
import Overlay from '../components/Overlay';
import About from '../components/About';
import Experiences from '../components/Experiences';
import Projects from '../components/Projects';
import Music from '../components/Music';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <div style={{ position: 'absolute', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Overlay */}
      <Overlay />

      {/* Main Content */}
      <main style={{ position: 'absolute', top: 0, left: 0, zIndex: 900, width: '100%', height: '100%', overflow: 'hidden' }}>
        <About />
        <Experiences />
        <Projects />
        <Music />
        <Contact />
      </main>
    </div>
  );
};

export default Home;
