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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Clear form on success
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! I will get back to you soon.'
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    } finally {
      setIsSubmitting(false);
    }
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
              {submitStatus.type && (
                <div className={`${styles.submitMessage} ${styles[submitStatus.type]}`}>
                  {submitStatus.message}
                </div>
              )}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={isSubmitting}
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
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.inputGroup}>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.messageInput}`}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 