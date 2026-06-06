import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Calendar, Share2, MessageCircle } from 'lucide-react';
import { BLOG_POSTS } from '../../utils/blogData';
import styles from './BlogPostPage.module.css';

export default function BlogPostPage() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);

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

  // Custom markdown parser for clean offline rendering of articles
  const renderContent = (text) => {
    return text.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className={styles.heading2}>{trimmed.replace('## ', '')}</h2>;
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

      return <p key={index} className={styles.paragraph}>{trimmed}</p>;
    });
  };

  return (
    <div className={styles.postContainer}>
      <div className="container">
        {/* Back Link */}
        <Link to="/blog" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Insights
        </Link>

        <div className={styles.layout}>
          {/* Main Article */}
          <article className={styles.mainArticle}>
            <header className={styles.postHeader}>
              <div className={styles.metaRow}>
                <span className={styles.metaItem}><User size={14} /> {post.author}</span>
                <span className={styles.metaItem}><Calendar size={14} /> {post.date}</span>
                <span className={styles.metaItem}><Clock size={14} /> {post.readTime}</span>
              </div>
              <h1 className={styles.postTitle}>{post.title}</h1>
            </header>

            <div className={styles.postImageWrapper}>
              <img src={post.image} alt={post.title} className={styles.postImage} />
            </div>

            <div className={styles.postBody}>
              {renderContent(post.content)}
            </div>

            {/* Social Share Callout */}
            <footer className={styles.postFooter}>
              <div className={styles.shareTitle}>Was this article helpful?</div>
              <div className={styles.shareButtons}>
                <button onClick={() => alert("Link copied to clipboard!")} className={styles.shareBtn}>
                  <Share2 size={16} /> Share Article
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
            </footer>
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarWidget}>
              <h4 className={styles.widgetTitle}>Recommended Reading</h4>
              <div className={styles.relatedList}>
                {relatedPosts.map(related => (
                  <Link to={`/blog/${related.id}`} key={related.id} className={styles.relatedCard}>
                    <div className={styles.relatedThumbWrapper}>
                      <img src={related.image} alt={related.title} className={styles.relatedThumb} />
                    </div>
                    <div className={styles.relatedInfo}>
                      <span className={styles.relatedDate}>{related.date}</span>
                      <h5 className={styles.relatedTitle}>{related.title}</h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Widget */}
            <div className={styles.ctaWidget}>
              <h3>Haul Out on Premium Lanes</h3>
              <p>Register as an owner-operator today and gain access to our manual dispatch networks.</p>
              <Link to="/register/carrier" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Join as Driver
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
