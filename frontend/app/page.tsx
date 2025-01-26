import React from 'react';
import Overlay from '../components/Overlay';
import BackgroundLayers from '../components/Background';

const Home: React.FC = () => {
  return (
    <div>
      <BackgroundLayers />
      <Overlay />
    </div>
  );
};

export default Home; 