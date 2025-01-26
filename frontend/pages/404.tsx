import { useRouter } from 'next/router';
import styles from '../styles/DetailPage.module.css';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Back
      </button>
      <div className={styles.content}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}