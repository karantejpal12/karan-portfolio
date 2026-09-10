import React, { useState, useRef, useEffect } from 'react';

const PortfolioAI = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m Karan\'s AI assistant. Ask me anything about his background, skills, experience, projects, or media coverage. 👋' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [activeSection, setActiveSection] = useState('about');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_CLAUDE_API_KEY
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          system: `You are an AI assistant representing Karan Tejpal, a Business Intelligence Engineer with 8+ years of experience. You have deep knowledge of his background, skills, work, and media coverage.

NAME: Karan Tejpal
CURRENT ROLE: Business Intelligence Engineer at Treasure AI (NYC), working from Burlington, MA

EXPERIENCE (8+ years):
- Business Intelligence Engineer at Treasure AI (May 2025–present)
- Sr. BI Developer at Cognowizz/MA Dept. of Public Health (Oct 2024–May 2025)
- Advisor Business Intelligence at Dell Technologies (Sep 2021–Sep 2024)
- Data Analyst at Kemper Insurance (Mar 2021–Sep 2021)
- BI Analyst at Cox Automotive (Mar 2020–Mar 2021)
- Data Analyst Intern at NextShift Robotics (Jan 2019–Sep 2019)
- Data Analyst at BOC India (Jun 2016–Dec 2018)

TECHNICAL SKILLS:
- BI & Analytics: Tableau, Power BI, Looker, HEX
- Data Engineering: SQL, Snowflake, dbt, Airflow, Databricks
- Programming: Python, R
- Other Tools: Fivetran, HubSpot, n8n, Make, Alteryx
- AI/Agentic: Claude Code, MCP

EDUCATION:
- M.S. in Business Analytics from UMass Lowell
- B.E. in Computer Engineering from DAV University

CERTIFICATIONS:
- dbt Analytics Engineering Certified
- Tableau Desktop Specialist
- AWS Cloud Practitioner
- Microsoft Power BI Data Analyst
- Google Analytics Certified

EXPERTISE AREAS:
- Analytics engineering & semantic layers
- GTM/revenue analytics
- Healthcare data & AI in healthcare (MA Dept. of Public Health experience)
- Predictive maternal healthcare
- AI-native workflows (agentic tooling, Claude Code, MCP)
- Data warehousing & modeling
- BI tool implementation
- Data storytelling

MEDIA COVERAGE & PUBLICATIONS:
1. The Hindu - "The Future of Predictive Maternal Healthcare"
2. Express Healthcare - "How AI could help reduce maternal and newborn health risks"
3. PharmaBiz - Healthcare analytics coverage
4. Medium - "Intelligent Health: How AI, Machine Learning and Data Analytics are Powering the Future"
5. AIFN - "The AI Evolution: Redefining Mobile App Experience"
6. Google Scholar - Academic publications on AI in healthcare

Keep responses conversational, natural, and professional. If asked about publications or media coverage, reference these sources. Be enthusiastic about his thought leadership in AI and healthcare analytics.`,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })).concat([{ role: 'user', content: userMessage }])
        })
      });

      const data = await response.json();
      const assistantMessage = data.content[0]?.text || 'Sorry, I couldn\'t process that.';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error. Make sure your API key is configured correctly.' 
      }]);
    }

    setLoading(false);
  };

  const sections = {
    about: {
      title: 'About',
      icon: 'ti-user'
    },
    experience: {
      title: 'Experience',
      icon: 'ti-briefcase'
    },
    projects: {
      title: 'Projects',
      icon: 'ti-chart-bar'
    },
    skills: {
      title: 'Skills',
      icon: 'ti-code'
    },
    media: {
      title: 'Media',
      icon: 'ti-news'
    }
  };

  const publications = [
    {
      outlet: 'The Hindu',
      title: 'The Future of Predictive Maternal Healthcare: Trustworthy Data, Robust Public Health Teams Can Help Save Lives',
      description: 'Thought leadership on using predictive analytics and AI to improve maternal healthcare outcomes in India.',
      url: 'https://www.thehindu.com/sci-tech/health/the-future-of-predictive-maternal-healthcare-trustworthy-data-robust-public-health-teams-can-help-save-lives/article71149651.ece',
      category: 'Healthcare Analytics'
    },
    {
      outlet: 'Express Healthcare',
      title: 'How AI Could Help Reduce Maternal and Newborn Health Risks Before They Become Emergencies',
      description: 'Deep dive into AI applications for predictive maternal and newborn health interventions.',
      url: 'https://www.expresshealthcare.in/news/how-ai-could-help-reduce-maternal-and-newborn-health-risks-before-they-become-emergencies/454529/',
      category: 'Healthcare Technology'
    },
    {
      outlet: 'PharmaBiz',
      title: 'Healthcare Analytics & Data-Driven Solutions',
      description: 'Coverage of AI and analytics solutions transforming pharmaceutical and healthcare sectors.',
      url: 'https://www.pharmabiz.com/NewsDetails.aspx?aid=186715&sid=1',
      category: 'Healthcare Innovation'
    },
    {
      outlet: 'Medium',
      title: 'Intelligent Health: How AI, Machine Learning and Data Analytics are Powering the Future',
      description: 'Comprehensive exploration of AI and machine learning applications in healthcare data analytics.',
      url: 'https://medium.com/@ktp1221995/intelligent-health-how-ai-machine-learning-and-data-analytics-are-powering-the-future-of-2113eb4b7e12',
      category: 'AI & Healthcare'
    },
    {
      outlet: 'AIFN',
      title: 'The AI Evolution: Redefining Mobile App Experience',
      description: 'Insights on how AI is transforming user experiences in modern mobile applications.',
      url: 'https://aifn.co/the-ai-evolution-redefining-mobile-app-experience/',
      category: 'AI Innovation'
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'about':
        return (
          <div className="section-content">
            <h1 style={{fontSize: '28px', marginBottom: '1rem'}}>Karan Tejpal</h1>
            <p style={{fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '2rem'}}>Business Intelligence Engineer | Analytics Engineering | Healthcare Data AI</p>
            
            <h3>About</h3>
            <p>8+ years of experience building scalable analytics solutions across healthcare, insurance, automotive, and AI-native organizations. Specialized in analytics engineering, GTM analytics, and healthcare data AI. Passionate about translating complex data into actionable insights using modern data stacks and AI-powered solutions.</p>
            
            <h3>Location & Background</h3>
            <p>Based in Burlington, MA | Currently at Treasure AI (NYC) | M.S. in Business Analytics (UMass Lowell) | B.E. in Computer Engineering (DAV University)</p>

            <h3>Thought Leadership</h3>
            <p>Active contributor to Indian healthcare technology discourse through publications in The Hindu, Express Healthcare, PharmaBiz, and Medium. Focused on advancing discussions around AI applications in predictive maternal healthcare and data-driven public health interventions.</p>
          </div>
        );
      
      case 'experience':
        return (
          <div className="section-content">
            <h2>Experience</h2>
            
            <div className="job">
              <h3>Business Intelligence Engineer</h3>
              <p style={{color: 'var(--text-secondary)'}}>Treasure AI • May 2025–Present</p>
              <p>Building BI solutions and analytics workflows for AI-native products. Implementing semantic layers and data contracts for enterprise customers.</p>
            </div>

            <div className="job">
              <h3>Sr. BI Developer</h3>
              <p style={{color: 'var(--text-secondary)'}}>Cognowizz / MA Dept. of Public Health • Oct 2024–May 2025</p>
              <p>Led healthcare data analytics initiatives. Modernized reporting infrastructure using Snowflake and dbt. Developed predictive models for maternal health outcomes.</p>
            </div>

            <div className="job">
              <h3>Advisor Business Intelligence</h3>
              <p style={{color: 'var(--text-secondary)'}}>Dell Technologies • Sep 2021–Sep 2024</p>
              <p>Enterprise BI strategy and implementation. Worked with large-scale data warehouses and multi-tenant reporting environments for Fortune 500 customers.</p>
            </div>

            <div className="job">
              <h3>Data Analyst</h3>
              <p style={{color: 'var(--text-secondary)'}}>Kemper Insurance • Mar 2021–Sep 2021</p>
              <p>P&C claims analytics. Dashboard development and KPI tracking using Power BI and Tableau.</p>
            </div>

            <div className="job">
              <h3>BI Analyst</h3>
              <p style={{color: 'var(--text-secondary)'}}>Cox Automotive • Mar 2020–Mar 2021</p>
              <p>Two-sided marketplace analytics. Built dashboards for seller and buyer metrics using Databricks.</p>
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="section-content">
            <h2>Projects & Publications</h2>
            
            <div className="project">
              <h3>dbt Analytics Engineering</h3>
              <p style={{color: 'var(--text-secondary)'}}>Certified (Scored 80/100)</p>
              <p>Expert in data transformation frameworks, semantic layers, and data contracts. Experience modernizing legacy data warehouses.</p>
            </div>

            <div className="project">
              <h3>Healthcare Data Analytics</h3>
              <p style={{color: 'var(--text-secondary)'}}>MA Dept. of Public Health</p>
              <p>Designed and implemented analytics for public health initiatives. Worked with sensitive healthcare datasets and compliance requirements. Developed predictive models for maternal and newborn health interventions.</p>
            </div>

            <div className="project">
              <h3>IEEE Publication</h3>
              <p style={{color: 'var(--text-secondary)'}}>IC3I 2024</p>
              <p>Published research on personalized medicine and AI applications in healthcare. Available on Google Scholar.</p>
            </div>

            <div className="project">
              <h3>Agentic AI Workflows</h3>
              <p style={{color: 'var(--text-secondary)'}}>Current Exploration</p>
              <p>Building AI-native analytics solutions using Claude Code, MCP, and n8n automation.</p>
            </div>

            <div className="project">
              <h3>Thought Leadership</h3>
              <p style={{color: 'var(--text-secondary)'}}>Healthcare Technology</p>
              <p>Published multiple articles on AI in healthcare, predictive maternal health, and data analytics in leading Indian publications.</p>
            </div>
          </div>
        );
      
      case 'skills':
        return (
          <div className="section-content">
            <h2>Skills & Certifications</h2>
            
            <h3>BI & Analytics Tools</h3>
            <div className="skill-grid">
              <span className="skill-tag">Tableau</span>
              <span className="skill-tag">Power BI</span>
              <span className="skill-tag">Looker</span>
              <span className="skill-tag">HEX</span>
            </div>

            <h3>Data Engineering & Warehousing</h3>
            <div className="skill-grid">
              <span className="skill-tag">SQL</span>
              <span className="skill-tag">Snowflake</span>
              <span className="skill-tag">dbt</span>
              <span className="skill-tag">Databricks</span>
              <span className="skill-tag">Airflow</span>
              <span className="skill-tag">Fivetran</span>
            </div>

            <h3>Programming</h3>
            <div className="skill-grid">
              <span className="skill-tag">Python</span>
              <span className="skill-tag">R</span>
            </div>

            <h3>AI & Agentic</h3>
            <div className="skill-grid">
              <span className="skill-tag">Claude Code</span>
              <span className="skill-tag">MCP</span>
              <span className="skill-tag">n8n</span>
            </div>

            <h3>Domain Expertise</h3>
            <div className="skill-grid">
              <span className="skill-tag">Healthcare Analytics</span>
              <span className="skill-tag">GTM/RevOps</span>
              <span className="skill-tag">Predictive Modeling</span>
            </div>

            <h3>Other Tools</h3>
            <div className="skill-grid">
              <span className="skill-tag">HubSpot</span>
              <span className="skill-tag">Make</span>
              <span className="skill-tag">Alteryx</span>
            </div>

            <h3>Certifications</h3>
            <ul style={{marginTop: '1rem'}}>
              <li>dbt Analytics Engineering Certified</li>
              <li>Tableau Desktop Specialist</li>
              <li>AWS Cloud Practitioner</li>
              <li>Microsoft Power BI Data Analyst</li>
              <li>Google Analytics Certified</li>
            </ul>
          </div>
        );

      case 'media':
        return (
          <div className="section-content">
            <h2>Media & Publications</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>Thought leadership and published articles on AI, healthcare analytics, and data-driven innovation.</p>
            
            {publications.map((pub, idx) => (
              <div key={idx} className="publication">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem'}}>
                  <div>
                    <h3 style={{margin: 0}}>{pub.outlet}</h3>
                    <p style={{margin: '0.25rem 0', fontSize: '12px', color: '#4A90D9', fontWeight: 500}}>{pub.category}</p>
                  </div>
                </div>
                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="publication-title">
                  {pub.title}
                  <i className="ti ti-external-link" style={{marginLeft: '0.5rem', fontSize: '13px'}}></i>
                </a>
                <p style={{margin: '0.75rem 0', fontSize: '14px', color: 'var(--text-secondary)'}}>{pub.description}</p>
              </div>
            ))}

            <div style={{marginTop: '2rem', padding: '1.25rem', backgroundColor: 'var(--surface-1)', borderRadius: '8px', borderLeft: '3px solid #4A90D9'}}>
              <h3 style={{marginTop: 0}}>Academic Work</h3>
              <p>Published IEEE research on personalized medicine and AI. View my full academic profile on <a href="https://scholar.google.com/citations?user=ClfmM1AAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" style={{color: '#4A90D9', textDecoration: 'none'}}>Google Scholar <i className="ti ti-external-link" style={{fontSize: '12px'}}></i></a></p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        <nav style={styles.nav}>
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                ...styles.navButton,
                ...(activeSection === key && styles.navButtonActive)
              }}
            >
              <i className={`ti ${section.icon}`} style={{marginRight: '0.5rem'}}></i>
              {section.title}
            </button>
          ))}
        </nav>
        
        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>

      <div style={styles.sidebar}>
        <div style={styles.chatHeader}>
          <h3 style={{margin: 0, fontSize: '16px'}}>Ask me anything</h3>
        </div>
        
        <div style={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
            }}>
              <p style={{margin: 0, fontSize: '14px'}}>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div style={styles.assistantMessage}>
              <p style={{margin: 0, fontSize: '14px', fontStyle: 'italic'}}>Typing...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my work..."
            disabled={loading}
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.sendButton}>
            <i className="ti ti-send"></i>
          </button>
        </form>
      </div>

      <style>{`
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
        * { box-sizing: border-box; }
        
        .section-content {
          color: var(--text-primary);
        }

        .section-content h2 {
          font-size: 22px;
          font-weight: 500;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
        }

        .section-content h3 {
          font-size: 16px;
          font-weight: 500;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .section-content p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin: 0.75rem 0;
        }

        .job {
          padding: 1.25rem;
          background: var(--surface-1);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #4A90D9;
        }

        .job h3 {
          margin-top: 0;
        }

        .project {
          padding: 1.25rem;
          background: var(--surface-1);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #4A90D9;
        }

        .publication {
          padding: 1.25rem;
          background: var(--surface-1);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #4A90D9;
        }

        .publication-title {
          display: inline-block;
          font-size: 15px;
          font-weight: 500;
          color: #4A90D9;
          text-decoration: none;
          margin: 0.5rem 0;
          transition: opacity 200ms;
        }

        .publication-title:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .skill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .skill-tag {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #4A90D9;
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .section-content ul {
          padding-left: 1.5rem;
          color: var(--text-secondary);
          font-size: 15px;
        }

        .section-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .section-content a {
          color: #4A90D9;
          text-decoration: none;
        }

        .section-content a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    gap: '1px',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
    flexWrap: 'wrap',
    overflowY: 'auto'
  },
  navButton: {
    padding: '0.5rem 1rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#666',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 200ms',
    fontWeight: 500,
    whiteSpace: 'nowrap'
  },
  navButtonActive: {
    borderColor: '#4A90D9',
    color: '#4A90D9',
    backgroundColor: 'rgba(74, 144, 217, 0.1)'
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem',
  },
  sidebar: {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #e0e0e0',
    borderRadius: '0 8px 8px 0'
  },
  chatHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '8px',
    maxWidth: '95%',
    wordWrap: 'break-word'
  },
  userMessage: {
    backgroundColor: '#4A90D9',
    color: 'white',
    alignSelf: 'flex-end',
    textAlign: 'right'
  },
  assistantMessage: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    alignSelf: 'flex-start'
  },
  inputForm: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #e0e0e0',
  },
  input: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '13px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    outline: 'none'
  },
  sendButton: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#4A90D9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default PortfolioAI;
