import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Share2, MessageCircle, ChevronRight, Bookmark } from 'lucide-react';
import { BLOG_POSTS } from '../../utils/blogData';
import styles from './BlogPostPage.module.css';

export default function BlogPostPage() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  const [copied, setCopied] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Article Not Found</h2>
        <p>The blog post you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="btn-primary">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom markdown parser for clean offline rendering of articles
  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className={styles.heading2}>
            <span className={styles.headingDecor} />
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className={styles.heading3}>{trimmed.replace('### ', '')}</h3>;
      }
      
      // Handle list items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <ul key={index} className={styles.blogList}>
            {trimmed.split('\n').map((line, i) => {
              const lineContent = line.replace(/^[\*\-]\s+/, '');
              // Parse bold markers inside list item
              if (lineContent.startsWith('**') && lineContent.includes(':**')) {
                const parts = lineContent.split(':**');
                return (
                  <li key={i}>
                    <strong>{parts[0].replace(/\*\*/g, '')}:</strong> {parts[1]}
                  </li>
                );
              }
              return <li key={i}>{lineContent}</li>;
            })}
          </ul>
        );
      }

      if (/^\d+\./.test(trimmed)) {
        return (
          <ol key={index} className={styles.blogOrderedList}>
            {trimmed.split('\n').map((line, i) => {
              const lineContent = line.replace(/^\d+\.\s+/, '');
              if (lineContent.startsWith('**') && lineContent.includes(':**')) {
                const parts = lineContent.split(':**');
                return (
                  <li key={i}>
                    <strong>{parts[0].replace(/\*\*/g, '')}:</strong> {parts[1]}
                  </li>
                );
              }
              return <li key={i}>{lineContent}</li>;
            })}
          </ol>
        );
      }

      // Handle table
      if (trimmed.includes('|') && trimmed.includes('-')) {
        const rows = trimmed.split('\n').map(r => r.trim()).filter(r => r !== '');
        if (rows.length > 2) {
          const headers = rows[0].split('|').map(h => h.trim()).filter(h => h !== '');
          const tableRows = rows.slice(2).map(r => r.split('|').map(c => c.trim()).filter(c => c !== ''));
          return (
            <div key={index} className={styles.tableWrapper}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    {headers.map((h, i) => <th key={i}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => <td key={j}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Handle pull quotes / blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className={styles.blockquote}>
            <p>{trimmed.replace('> ', '')}</p>
          </blockquote>
        );
      }

      return <p key={index} className={styles.paragraph}>{trimmed}</p>;
    });
  };

  return (
    <div className={styles.blogPostWrapper}>
      {/* Immersive Hero Header */}
      <div className={styles.heroHeader} style={{ backgroundImage: `url(${post.image})` }}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <Link to="/blog" className={styles.backButton}>
              <ArrowLeft size={14} /> Back to Insights
            </Link>
            
            <div className={styles.categoryBadge}>{post.category || 'Insights'}</div>
            
            <h1 className={styles.postTitle}>{post.title}</h1>
            
            <div className={styles.metaRow}>
              <div className={styles.authorBadge}>
                <div className={styles.authorAvatar}>
                  {post.author.charAt(0)}
                </div>
                <div>
                  <span className={styles.authorName}>{post.author}</span>
                  <span className={styles.authorRole}>Logistics Expert</span>
                </div>
              </div>
              
              <div className={styles.metaDivider} />
              
              <div className={styles.metaDetails}>
                <span className={styles.metaItem}><Calendar size={14} /> {post.date}</span>
                <span className={styles.metaItem}><Clock size={14} /> {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reading Section */}
      <div className={styles.readingContainer}>
        <div className="container">
          <div className={styles.layout}>
            {/* Reading Column */}
            <main className={styles.mainContent}>
              <div className={styles.postBody}>
                {renderContent(post.content)}
              </div>

              {/* Author Bio Card */}
              <div className={styles.authorCard}>
                <div className={styles.authorCardAvatar}>
                  {post.author.charAt(0)}
                </div>
                <div className={styles.authorCardInfo}>
                  <h4>About The Author: {post.author}</h4>
                  <p>Dedicated to helping individual drivers and owner-operators navigate US logistics corridors. Specializes in rate negotiations, carrier compliance, and minimizing empty deadhead miles.</p>
                </div>
              </div>

              {/* Action Footer */}
              <div className={styles.postFooter}>
                <div className={styles.shareSection}>
                  <span>Enjoyed this guide? Share with other drivers</span>
                  <div className={styles.shareButtons}>
                    <button onClick={handleShare} className={styles.shareBtn}>
                      <Share2 size={16} /> {copied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                    <a 
                      href="https://wa.me/18005550199" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.whatsAppBtn}
                    >
                      <MessageCircle size={16} /> Discuss on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Driver Registration Callout */}
              <div className={styles.registerCallout}>
                <div className={styles.calloutGlow} />
                <div className={styles.calloutContent}>
                  <h3>Start Hauling High-Paying Lanes</h3>
                  <p>Register as a driver today. Our manual dispatch team handles all rate negotiations and broker packets, letting you focus on the road with an 8% flat service cut.</p>
                  <Link to="/register/carrier" className="btn-primary" style={{ background: 'var(--accent-gold)', color: '#000', marginTop: '10px' }}>
                    Register as Driver <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Keep Reading Grid */}
      <section className={styles.keepReadingSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Keep Reading</h2>
            <p>Expand your logistics knowledge with more guides for owner-operators</p>
          </div>

          <div className={styles.relatedGrid}>
            {relatedPosts.map(related => (
              <Link to={`/blog/${related.id}`} key={related.id} className={styles.relatedCard}>
                <div className={styles.relatedThumbWrapper}>
                  <img src={related.image} alt={related.title} className={styles.relatedThumb} />
                  <div className={styles.relatedCategory}>{related.category || 'Insights'}</div>
                </div>
                <div className={styles.relatedContent}>
                  <div className={styles.relatedMeta}>
                    <span>{related.date}</span>
                    <span>•</span>
                    <span>{related.readTime}</span>
                  </div>
                  <h4>{related.title}</h4>
                  <p>{related.summary}</p>
                  <span className={styles.readLink}>Read Article <ChevronRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
