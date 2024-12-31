import React from 'react';
import styles from '../styles/Overlay.module.css';

const Overlay: React.FC = () => {
  return (
    <div className={styles.box}>
      <div className={styles.frame}>
        <div className={styles.overlapGroup}>
          <div className={styles.img}>
            <div className={styles.overlapGroup}>
              <div className={styles.behindGlassGlows}>
                <div className={styles.playGlow} />
                <div className={styles.frontGlow} />
                <div className={styles.backGlow} />
                <div className={styles.spotifyGlow} />
                <div className={styles.linkedinGlow} />
                <div className={styles.githubGlow} />
                <div className={styles.fullfrontGlow} />
                <div className={styles.fullbackGlow} />
              </div>
              <img
                className={styles.frameExtension}
                alt="Frame extension"
                src="https://c.animaapp.com/BCw7hWIC/img/frame-extension.svg"
              />
              <img
                className={styles.img}
                alt="Frame"
                src="https://c.animaapp.com/BCw7hWIC/img/frame1.svg"
              />
            </div>
          </div>
          <div className={styles.buttons}>
            <div className={styles.githubIcon}>
              <div className={styles.iconGithubWrapper}>
                <img
                  className={styles.iconGithub}
                  alt="Icon github"
                  src="https://c.animaapp.com/BCw7hWIC/img/---icon--github-@2x.png"
                />
              </div>
            </div>
            <div className={styles.linkedin}>
              <div className={styles.overlap}>
                <div className={styles.subtractWrapper}>
                  <img
                    className={styles.subtract}
                    alt="Subtract"
                    src="https://c.animaapp.com/BCw7hWIC/img/subtract-1.svg"
                  />
                </div>
                <img
                  className={styles.iconLinkedinIn}
                  alt="Icon linkedin in"
                  src="https://c.animaapp.com/BCw7hWIC/img/---icon--linkedin-in-@2x.png"
                />
              </div>
            </div>
            <div className={styles.mail}>
              <div className={styles.iconEnvelopeClosedWrapper}>
                <img
                  className={styles.iconEnvelopeClosed}
                  alt="Icon envelope closed"
                  src="https://c.animaapp.com/BCw7hWIC/img/---icon--envelope-closed-@2x.png"
                />
              </div>
            </div>
            <div className={styles.mainPlayButton}>
              <div className={styles.playbuttonTriangleWrapper}>
                <img
                  className={styles.playbuttonTriangle}
                  alt="Playbutton triangle"
                  src="https://c.animaapp.com/BCw7hWIC/img/playbutton-triangle.svg"
                />
              </div>
            </div>
            <img
              className={styles.frontButton}
              alt="Front button"
              src="https://c.animaapp.com/BCw7hWIC/img/front-button.svg"
            />
            <img
              className={styles.fullfrontButton}
              alt="Fullfront button"
              src="https://c.animaapp.com/BCw7hWIC/img/fullfront-button@2x.png"
            />
            <img
              className={styles.backButton}
              alt="Back button"
              src="https://c.animaapp.com/BCw7hWIC/img/back-button.svg"
            />
            <img
              className={styles.fullbackButton}
              alt="Fullback button"
              src="https://c.animaapp.com/BCw7hWIC/img/fullback-button@2x.png"
            />
            <div className={styles.spotify}>
              <div className={styles.iconSpotifyWrapper}>
                <img
                  className={styles.iconSpotify}
                  alt="Icon spotify"
                  src="https://c.animaapp.com/BCw7hWIC/img/---icon--spotify-@2x.png"
                />
              </div>
            </div>
          </div>
          <img
            className={styles.img}
            alt="Outer glass frame"
            src="https://c.animaapp.com/BCw7hWIC/img/outer-glass-frame.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Overlay;
