import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline, IoPauseOutline } from 'react-icons/io5';
import styles from '../styles/ContentPlayer.module.css';

interface ContentItem {
  id: string;
  name: string;
  role?: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  learningOutcomes: string[];
  dateRange: string;
  position: number;
  published: boolean;
}

interface ContentPlayerProps<T> {
  items: T[];
  onItemClick: (id: string) => void;
  onHoverChange: (item: T | null) => void;
  renderItem: (item: T, isActive: boolean) => React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function ContentPlayer<T extends { id: string }>({
  items,
  onItemClick,
  onHoverChange,
  renderItem,
  title,
  description,
  className
}: ContentPlayerProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (id: string, index: number) => {
    setActiveIndex(index);
    onItemClick(id);
  };

  return (
    <div className={className}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.separator} />
        <div className={styles.list}>
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, index)}
              onMouseEnter={() => onHoverChange(item)}
              onMouseLeave={() => onHoverChange(null)}
            >
              {renderItem(item, index === activeIndex)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 