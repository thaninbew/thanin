import React from 'react';
import styles from '../styles/Experiences.module.css';
import { ListItem, SectionProps } from '../types/common';
import ExperiencesPlayer from './ExperiencesPlayer';

const ListItemComponent: React.FC<ListItem> = ({ imageUrl, name, role, dateRange }) => {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceImagePlaceholder}></div>
      <div className={styles.experienceInfo}>
        <h3 className={styles.experienceName}>{name}</h3>
        <p className={styles.experienceRole}>{role}</p>
        <p className={styles.experienceDateRange}>{dateRange}</p>
      </div>
    </div>
  );
};

const ListSection: React.FC<SectionProps> = ({ title, description, items }) => {
  return (
    <div className={styles.experiencesContainer}>
      <div className={styles.experiences}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerImagePlaceholder}></div>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <p className={styles.description}>{description}</p>
          <div className={styles.separator} />
        </div>

        <div className={styles.experiencesList}>
          {items.map((item) => (
            <ListItemComponent key={item.id} {...item} />
          ))}
        </div>
      </div>
      <ExperiencesPlayer />
    </div>
  );
};

export default ListSection; 