import React, { useState } from 'react';
import styles from '../styles/Contact.module.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

interface ContactMethod {
  id: string;
  name: string;
  value: string;
  icon?: React.ReactNode;
  link?: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: '1',
    name: 'Email',
    value: 'bewxtt@gmail.com',
    icon: <FaEnvelope size={24} />,
    link: 'mailto:bewxtt@gmail.com'
  },
  {
    id: '2',
    name: 'LinkedIn',
    value: 'linkedin.com/in/thaninbew',
    icon: <FaLinkedin size={24} />,
    link: 'https://linkedin.com/in/thaninbew'
  },
  {
    id: '3',
    name: 'GitHub',
    value: 'github.com/thaninbew',
    icon: <FaGithub size={24} />,
    link: 'https://github.com/thaninbew'
  }
];

const ContactItem: React.FC<ContactMethod> = ({ name, value, icon, link }) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.contactItem}
    >
      <div className={styles.contactImagePlaceholder}>
        {icon}
      </div>
      <div className={styles.contactInfo}>
        <h3 className={styles.contactName}>{name}</h3>
        <p className={styles.contactValue}>{value}</p>
      </div>
    </a>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contact}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerImagePlaceholder}>
              <FaEnvelope size={80} />
            </div>
            <h1 className={styles.title}>Contact Me</h1>
          </div>
          <p className={styles.description}>
            Feel free to reach out! I'm always open to discussing new opportunities and ideas.
          </p>
          <div className={styles.separator} />
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.contactList}>
            {contactMethods.map((method) => (
              <ContactItem key={method.id} {...method} />
            ))}
          </div>

          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.messageInput}`}
                />
              </div>
              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 