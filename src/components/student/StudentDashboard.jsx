// components/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [stats, setStats] = useState({
    totalAttempted: 0,
    averageScore: 0,
    completionRate: 0,
    bestScore: 0
  });
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock available quizzes data
        const mockAvailableQuizzes = [
          {
            id: 'q1',
            title: 'Introduction à JavaScript',
            description: 'Les bases du langage JavaScript pour les débutants',
            createdBy: 'Prof. Dupont',
            createdAt: '2025-04-25',
            timeLimit: 30,
            questionsCount: 15,
            dueDate: '2025-05-10',
            category: 'Web Development'
          },
          {
            id: 'q2',
            title: 'Les bases de React',
            description: 'Comprendre les concepts fondamentaux de React',
            createdBy: 'Prof. Dupont',
            createdAt: '2025-04-20',
            timeLimit: 45,
            questionsCount: 12,
            dueDate: '2025-05-15',
            category: 'Web Development'
          },
          {
            id: 'q4',
            title: 'Introduction à Python',
            description: 'Les bases du langage Python pour les débutants',
            createdBy: 'Prof. Martin',
            createdAt: '2025-04-10',
            timeLimit: 40,
            questionsCount: 18,
            dueDate: '2025-05-20',
            category: 'Programming'
          }
        ];
        
        // Mock completed quizzes data
        const mockCompletedQuizzes = [
          {
            id: 'q3',
            title: 'CSS Avancé',
            description: 'Techniques avancées de CSS pour le design web moderne',
            createdBy: 'Prof. Garcia',
            attemptedAt: '2025-04-28',
            timeLimit: 35,
            questionsCount: 20,
            score: 72,
            totalPoints: 20,
            earnedPoints: 14.4,
            category: 'Web Development'
          },
          {
            id: 'q5',
            title: 'Bases de données SQL',
            description: 'Introduction aux bases de données relationnelles',
            createdBy: 'Prof. Li',
            attemptedAt: '2025-04-22',
            timeLimit: 50,
            questionsCount: 22,
            score: 88,
            totalPoints: 22,
            earnedPoints: 19.36,
            category: 'Databases'
          }
        ];

        // Mock upcoming quizzes (scheduled but not yet available)
        const mockUpcomingQuizzes = [
          {
            id: 'q6',
            title: 'Algorithmes et Structures de Données',
            description: 'Les algorithmes fondamentaux et structures de données en informatique',
            createdBy: 'Prof. Johnson',
            availableFrom: '2025-05-15',
            availableTo: '2025-05-30',
            timeLimit: 60,
            questionsCount: 25,
            category: 'Computer Science'
          },
          {
            id: 'q7',
            title: 'Sécurité Web',
            description: 'Principes de base de la sécurité des applications web',
            createdBy: 'Prof. Garcia',
            availableFrom: '2025-05-20',
            availableTo: '2025-06-05',
            timeLimit: 45,
            questionsCount: 18,
            category: 'Web Development'
          }
        ];
        
        // Calculate overall statistics
        const totalAttempted = mockCompletedQuizzes.length;
        const averageScore = mockCompletedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / 
                            (totalAttempted || 1);
        const completionRate = (totalAttempted / (totalAttempted + mockAvailableQuizzes.length)) * 100;
        const bestScore = Math.max(...mockCompletedQuizzes.map(quiz => quiz.score), 0);
        
        setAvailableQuizzes(mockAvailableQuizzes);
        setCompletedQuizzes(mockCompletedQuizzes);
        setUpcomingQuizzes(mockUpcomingQuizzes);
        setStats({
          totalAttempted,
          averageScore,
          completionRate,
          bestScore
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter quizzes based on search term
  const filterQuizzes = (quizzes) => {
    if (!searchTerm) return quizzes;
    
    return quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Calculate days left until due date
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get appropriate label color based on days left
  const getDueDateClass = (dueDate) => {
    const daysLeft = getDaysLeft(dueDate);
    if (daysLeft <= 1) return 'urgent';
    if (daysLeft <= 3) return 'soon';
    return 'normal';
  };

  // Get appropriate label color based on score
  const getScoreClass = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="content-area">
      <div className="welcome-banner">
        <h1>Bienvenue, {currentUser.name}</h1>
        <p className="dashboard-date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon quiz-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalAttempted}</div>
            <div className="stat-label">Quiz Terminés</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon score-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.averageScore.toFixed(1)}%</div>
            <div className="stat-label">Score Moyen</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completion-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.completionRate.toFixed(0)}%</div>
            <div className="stat-label">Taux de Complétion</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon best-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.bestScore}%</div>
            <div className="stat-label">Meilleur Score</div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher des quiz..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Quiz Disponibles
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Quiz Complétés
          </button>
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            À Venir
          </button>
        </div>
      </div>
      
      <div className="quiz-lists">
        {/* Available Quizzes */}
        {activeTab === 'available' && (
          <>
            <h2>Quiz Disponibles</h2>
            {filterQuizzes(availableQuizzes).length === 0 ? (
              <div className="no-results">
                <p>Aucun quiz disponible pour le moment.</p>
              </div>
            ) : (
              <div className="quiz-grid">
                {filterQuizzes(availableQuizzes).map(quiz => (
                  <div className="quiz-card" key={quiz.id}>
                    <div className="quiz-card-header">
                      <h3>{quiz.title}</h3>
                      <span className="category-badge">{quiz.category}</span>
                    </div>
                    <div className="quiz-card-body">
                      <p className="quiz-description">{quiz.description}</p>
                      <div className="quiz-meta">
                        <div className="meta-item">
                          <span className="meta-label">Créé par:</span>
                          <span className="meta-value">{quiz.createdBy}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Questions:</span>
                          <span className="meta-value">{quiz.questionsCount}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Temps:</span>
                          <span className="meta-value">{quiz.timeLimit} min</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Date limite:</span>
                          <span className={`meta-value due-date ${getDueDateClass(quiz.dueDate)}`}>
                            {formatDate(quiz.dueDate)} 
                            ({getDaysLeft(quiz.dueDate)} jours restants)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="quiz-card-footer">
                      <Link to={`/student/quiz/${quiz.id}`} className="btn btn-primary">
                        Commencer
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Completed Quizzes */}
        {activeTab === 'completed' && (
          <>
            <h2>Quiz Complétés</h2>
            {filterQuizzes(completedQuizzes).length === 0 ? (
              <div className="no-results">
                <p>Vous n'avez pas encore complété de quiz.</p>
              </div>
            ) : (
              <div className="quiz-grid">
                {filterQuizzes(completedQuizzes).map(quiz => (
                  <div className="quiz-card" key={quiz.id}>
                    <div className="quiz-card-header">
                      <h3>{quiz.title}</h3>
                      <span className="category-badge">{quiz.category}</span>
                    </div>
                    <div className="quiz-card-body">
                      <p className="quiz-description">{quiz.description}</p>
                      <div className="quiz-result">
                        <div className={`score-badge ${getScoreClass(quiz.score)}`}>
                          {quiz.score}%
                        </div>
                        <div className="points">
                          {quiz.earnedPoints}/{quiz.totalPoints} points
                        </div>
                      </div>
                      <div className="quiz-meta">
                        <div className="meta-item">
                          <span className="meta-label">Créé par:</span>
                          <span className="meta-value">{quiz.createdBy}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Complété le:</span>
                          <span className="meta-value">{formatDate(quiz.attemptedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="quiz-card-footer">
                      <Link to={`/student/results/${quiz.id}`} className="btn btn-secondary">
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* Upcoming Quizzes */}
        {activeTab === 'upcoming' && (
          <>
            <h2>Quiz à Venir</h2>
            {filterQuizzes(upcomingQuizzes).length === 0 ? (
              <div className="no-results">
                <p>Aucun quiz à venir pour le moment.</p>
              </div>
            ) : (
              <div className="quiz-grid">
                {filterQuizzes(upcomingQuizzes).map(quiz => (
                  <div className="quiz-card upcoming" key={quiz.id}>
                    <div className="quiz-card-header">
                      <h3>{quiz.title}</h3>
                      <span className="category-badge">{quiz.category}</span>
                    </div>
                    <div className="quiz-card-body">
                      <p className="quiz-description">{quiz.description}</p>
                      <div className="quiz-meta">
                        <div className="meta-item">
                          <span className="meta-label">Créé par:</span>
                          <span className="meta-value">{quiz.createdBy}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Questions:</span>
                          <span className="meta-value">{quiz.questionsCount}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Temps:</span>
                          <span className="meta-value">{quiz.timeLimit} min</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Disponible du:</span>
                          <span className="meta-value">
                            {formatDate(quiz.availableFrom)} au {formatDate(quiz.availableTo)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="quiz-card-footer">
                      <button className="btn btn-disabled" disabled>
                        Pas encore disponible
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;