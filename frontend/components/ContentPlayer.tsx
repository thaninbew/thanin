import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import styles from '../styles/ContentPlayer.module.css';

interface ContentItem {
  id: string;
  name: string;
  shortDesc: string;
  playerGif: string;
}

interface ContentPlayerProps<T extends ContentItem> {
  items: T[];
  onItemClick: (id: string) => void;
  onHoverChange: (item: T | null) => void;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  className?: string;
  title: string;
  description: string;
}

export default function ContentPlayer<T extends ContentItem>({
  items,
  onItemClick,
  onHoverChange,
  renderItem,
  className = '',
  title,
  description
}: ContentPlayerProps<T>) {
  const [hoveredItem, setHoveredItem] = useState<T | null>(null);
  const [currentItem, setCurrentItem] = useState<T>(items[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const resetProgress = useCallback(() => {
    if (progressRef.current) {
      // Reset width first
      progressRef.current.style.width = '0%';
      // Remove all classes first
      progressRef.current.className = styles.progress;
      // Force reflow
      void progressRef.current.offsetHeight;
      // Add appropriate class
      progressRef.current.className = `${styles.progress} ${isPlaying ? styles.progressRunning : styles.progressPaused}`;
    }
  }, [isPlaying]);

  const nextItem = useCallback(() => {
    console.log('Next item clicked');
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % items.length;
      setCurrentItem(items[nextIndex]);
      return nextIndex;
    });
    resetProgress();
  }, [items, resetProgress]);

  const previousItem = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === 0 ? items.length - 1 : prevIndex - 1;
      setCurrentItem(items[nextIndex]);
      return nextIndex;
    });
    resetProgress();
  }, [items, resetProgress]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    if (progressRef.current) {
      progressRef.current.className = `${styles.progress} ${isPlaying ? styles.progressPaused : styles.progressRunning}`;
    }
  }, [isPlaying]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || hoveredItem) {
      console.log('Auto-play stopped:', { isPlaying, hasHover: !!hoveredItem });
      return;
    }

    console.log('Starting auto-play interval');
    const interval = setInterval(() => {
      nextItem();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, hoveredItem, nextItem]);

  // Initialize progress bar animation on mount
  useEffect(() => {
    resetProgress();
  }, [resetProgress]);

  // Handle animation state changes
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.className = `${styles.progress} ${isPlaying ? styles.progressRunning : styles.progressPaused}`;
    }
  }, [isPlaying]);

  const handleHover = useCallback((item: T | null) => {
    setHoveredItem(item);
    onHoverChange(item);
    // Reset progress bar when hovering over a new item
    if (item && progressRef.current) {
      progressRef.current.style.width = '0%';
      progressRef.current.className = styles.progress;
      void progressRef.current.offsetHeight;
      progressRef.current.className = `${styles.progress} ${isPlaying ? styles.progressRunning : styles.progressPaused}`;
    }
  }, [onHoverChange, isPlaying]);

  const displayedItem = hoveredItem || currentItem;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerImagePlaceholder}></div>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.itemsList}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item.id)}
              onMouseEnter={() => handleHover(item)}
              onMouseLeave={() => handleHover(null)}
            >
              {renderItem(item, item.id === displayedItem.id)}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.player}>
        <div className={styles.sectionLabel}>Now Playing</div>
        <div className={styles.playerContent}>
          <div 
            className={styles.playerImagePlaceholder}
            style={{
              backgroundImage: `url(${displayedItem.playerGif})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <h2 className={styles.playerTitle}>
            {displayedItem.name}
          </h2>
          <p className={styles.playerSubtitle}>
            {displayedItem.shortDesc}
          </p>
          
          <div className={styles.playerControls}>
            <div className={styles.progressBar}>
              <div 
                ref={progressRef}
                className={`${styles.progress} ${isPlaying ? styles.progressRunning : styles.progressPaused}`}
              ></div>
            </div>
            <div className={styles.controlButtons}>
              <button 
                className={styles.controlButton}
                onClick={previousItem}
              >
                <IoPlayBackOutline size={33} />
              </button>
              <button 
                className={`${styles.playButton} ${styles.circular}`}
                onClick={togglePlayPause}
              >
                {isPlaying ? <IoPauseOutline size={33} /> : <IoPlayOutline size={33} />}
              </button>
              <button 
                className={styles.controlButton}
                onClick={nextItem}
              >
                <IoPlayForwardOutline size={33} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 