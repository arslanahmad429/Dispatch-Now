import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Calendar } from 'lucide-react';
import { BLOG_POSTS } from '../../utils/blogData';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
  const gridPosts = BLOG_POSTS.filter(p => p.id !== featuredPost.id);

  return (
    <div className={styles.blogContainer}>
      {/* Blog Page Header */}
      <section className={styles.blogHeader}>
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Insights & Logistics Knowledge
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={styles.subtitle}
          >
            Stay updated with industry guidelines, routing tips, compliance updates, and strategies to maximize owner-operator revenue.
          </motion.p>
        </div>
      </section>

      <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
        {/* Featured Post Card */}
        {featuredPost && (
          <motion.div 
            className={styles.featuredCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.featuredImageWrapper}>
              <img src={featuredPost.image} alt={featuredPost.title} className={styles.featuredImage} />
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}><User size={14} /> {featuredPost.author}</span>
                <span className={styles.metaItem}><Calendar size={14} /> {featuredPost.date}</span>
                <span className={styles.metaItem}><Clock size={14} /> {featuredPost.readTime}</span>
              </div>
              <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              <p className={styles.featuredSummary}>{featuredPost.summary}</p>
              <Link to={`/blog/${featuredPost.id}`} className={styles.readFeaturedBtn}>
                Read Full Article <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Small Blog Cards Grid */}
        <h3 className={styles.sectionTitle}>All Articles</h3>
        <div className={styles.blogGrid}>
          {gridPosts.map((post, idx) => (
            <motion.div 
              key={post.id}
              className={styles.blogCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={styles.cardImageWrapper}>
                <img src={post.image} alt={post.title} className={styles.cardImage} />
                
                {/* Transparent overlay visible on hover */}
                <div className={styles.cardOverlay}>
                  <p className={styles.overlayText}>{post.summary}</p>
                  <Link to={`/blog/${post.id}`} className={styles.arrowButton} aria-label="Open article">
                    <ArrowRight size={22} />
                  </Link>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h4 className={styles.cardTitle}>{post.title}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
