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
              <Link to={`/blog/${featuredPost.id}`} style={{ display: 'block', height: '100%', width: '100%' }}>
                <img src={featuredPost.image} alt={featuredPost.title} className={styles.featuredImage} />
              </Link>
            </div>
            <div className={styles.featuredContent}>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}><User size={14} /> {featuredPost.author}</span>
                <span className={styles.metaItem}><Calendar size={14} /> {featuredPost.date}</span>
                <span className={styles.metaItem}><Clock size={14} /> {featuredPost.readTime}</span>
              </div>
              <Link to={`/blog/${featuredPost.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
              </Link>
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className={styles.blogCard} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                <div className={styles.cardImageWrapper}>
                  <img src={post.image} alt={post.title} className={styles.cardImage} />
                  
                  {/* Transparent overlay visible on hover */}
                  <div className={styles.cardOverlay}>
                    <p className={styles.overlayText}>{post.summary}</p>
                    <div className={styles.arrowButton} aria-label="Open article">
                      <ArrowRight size={22} />
                    </div>
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
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
