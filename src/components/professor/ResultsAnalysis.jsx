// components/professor/ResultsAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ResultsAnalysis = () => {
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({
    attempts: 0,
    avgScore: 0,
    highestScore: 0,
    lowestScore: 0,
    medianScore: 0,
    completionRate: 0
  });
  const [questionStats, setQuestionStats] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Mock API call to get quiz and results data
    const fetchData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock quiz data
      const mockQuiz = {
        id: quizId || 'q1',
        title: 'Introduction à JavaScript',
        description: 'Les bases du langage JavaScript pour les débutants',
        createdAt: '2025-04-25',
        questionsCount: 15,
        timeLimit: 30
      };
      
      // Mock results data
      const mockResults = [
        {
          id: 'r1',
          studentId: 's1',
          studentName: 'Marie Dubois',
          startedAt: '2025-04-27T10:15:23',
          completedAt: '2025-04-27T10:42:18',
          score: 85,
          timeSpent: 1615, // seconds
          answers: generateMockAnswers(15, 85)
        },
        {
          id: 'r2',
          studentId: 's2',
          studentName: 'Thomas Bernard',
          startedAt: '2025-04-27T11:20:45',
          completedAt: '2025-04-27T11:48:12',
          score: 93,
          timeSpent: 1647,
          answers: generateMockAnswers(15, 93)
        },
        {
          id: 'r3',
          studentId: 's3',
          studentName: 'Sophie Martin',
          startedAt: '2025-04-27T14:05:11',
          completedAt: '2025-04-27T14:29:58',
          score: 72,
          timeSpent: 1487,
          answers: generateMockAnswers(15, 72)
        },
        {
          id: 'r4',
          studentId: 's4',
          studentName: 'Lucas Petit',
          startedAt: '2025-04-28T09:10:33',
          completedAt: '2025-04-28T09:38:45',
          score: 65,
          timeSpent: 1692,
          answers: generateMockAnswers(15, 65)
        },
        {
          id: 'r5',
          studentId: 's5',
          studentName: 'Emma Rousseau',
          startedAt: '2025-04-28T15:22:17',
          completedAt: '2025-04-28T15:48:42',
          score: 78,
          timeSpent: 1585,
          answers: generateMockAnswers(15, 78)
        }
      ];
      
      // Generate question statistics
      const mockQuestionStats = Array.from({ length: 15 }, (_, i) => {
        const correctRate = Math.floor(Math.random() * 40) + 60; // Between 60% and 100%
        return {
          questionId: `q${i+1}`,
          questionNumber: i + 1,
          questionText: `Question ${i+1} sur JavaScript`,
          correctAnswers: Math.floor((mockResults.length * correctRate) / 100),
          totalAttempts: mockResults.length,
          correctRate: correctRate,
          avgTimeSpent: Math.floor(Math.random() * 30) + 20 // Between 20 and 50 seconds
        };
      });
      
      // Calculate overall statistics
      const scores = mockResults.map(result => result.score);
      const overallStats = {
        attempts: mockResults.length,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        highestScore: Math.max(...scores),
        lowestScore: Math.min(...scores),
        medianScore: calculateMedian(scores),
        completionRate: 100 // Assuming all students completed the quiz
      };
      
      setQuiz(mockQuiz);
      setResults(mockResults);
      setStatistics(overallStats);
      setQuestionStats(mockQuestionStats);
      setLoading(false);
    };
    
    fetchData();
  }, [quizId]);

  // Helper function to generate mock answers for each student
  function generateMockAnswers(questionCount, overallScore) {
    const correctCount = Math.floor((questionCount * overallScore) / 100);
    const answers = [];
    
    for (let i = 0; i < questionCount; i++) {
      const isCorrect = i < correctCount;
      answers.push({
        questionId: `q${i+1}`,
        selectedOption: isCorrect ? 'correct_option' : 'wrong_option',
        isCorrect: isCorrect,
        timeSpent: Math.floor(Math.random() * 120) + 30 // Between 30 and 150 seconds
      });
    }
    
    // Shuffle the answers so the correct ones are not all at the beginning
    return answers.sort(() => Math.random() - 0.5);
  }

  // Helper function to calculate median
  function calculateMedian(values) {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  }

  // Format time from seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR');
  };

  // Filter results based on selected filter
  const filteredResults = results.filter(result => {
    if (filter === 'high') return result.score >= 80;
    if (filter === 'medium') return result.score >= 60 && result.score < 80;
    if (filter === 'low') return result.score < 60;
    return true; // 'all' filter
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'score') {
      comparison = a.score - b.score;
    } else if (sortBy === 'name') {
      comparison = a.studentName.localeCompare(b.studentName);
    } else if (sortBy === 'time') {
      comparison = a.timeSpent - b.timeSpent;
    } else { // 'date'
      comparison = new Date(a.completedAt) - new Date(b.completedAt);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <div className="loading">Chargement des résultats...</div>;
  }

  return (
    <div className="content-area">
      <div className="header-actions">
        <h1>Analyse des Résultats</h1>
        <Link to="/professor/manage-quiz" className="btn btn-secondary">Retour aux Quiz</Link>
      </div>
      
      {quiz && (
        <div className="quiz-info-banner">
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
          <div className="quiz-meta">
            <span>Créé le: {quiz.createdAt}</span>
            <span>Questions: {quiz.questionsCount}</span>
            <span>Temps limite: {quiz.timeLimit} minutes</span>
          </div>
        </div>
      )}
      
      <div className="statistics-cards">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tentatives</h3>
          </div>
          <div className="card-content">
            <p className="stat-number">{statistics.attempts}</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Score Moyen</h3>
          </div>
          <div className="card-content">
            <p className="stat-number">{statistics.avgScore.toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Score le Plus Élevé</h3>
          </div>
          <div className="card-content">
            <p className="stat-number">{statistics.highestScore}%</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Score le Plus Bas</h3>
          </div>
          <div className="card-content">
            <p className="stat-number">{statistics.lowestScore}%</p>
          </div>
        </div>
      </div>
      
      <div className="section mt-4">
        <h2>Performance par Question</h2>
        <div className="question-stats-container">
          {questionStats.map((qStat) => (
            <div className="question-stat-card" key={qStat.questionId}>
              <div className="question-header">
                <h4>Q{qStat.questionNumber}</h4>
                <div className={`correct-rate ${qStat.correctRate >= 80 ? 'high' : qStat.correctRate >= 60 ? 'medium' : 'low'}`}>
                  {qStat.correctRate}% correct
                </div>
              </div>
              <p className="question-text">{qStat.questionText}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${qStat.correctRate}%` }}
                ></div>
              </div>
              <div className="question-meta">
                <span>Réponses correctes: {qStat.correctAnswers}/{qStat.totalAttempts}</span>
                <span>Temps moyen: {qStat.avgTimeSpent}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section mt-4">
        <div className="section-header">
          <h2>Résultats des Étudiants</h2>
          <div className="filters-container">
        
            <select value={filter} onChange={handleFilterChange}>
                <option value="all">Tous les résultats</option>
                <option value="high">Score élevé (≥ 80%)</option>
                <option value="medium">Score moyen (60-79%)</option>
                <option value="low">Score faible (&lt; 60%)</option>
            </select>
            
            <select value={sortBy} onChange={handleSortChange}>
              <option value="date">Trier par date</option>
              <option value="score">Trier par score</option>
              <option value="name">Trier par nom</option>
              <option value="time">Trier par temps</option>
            </select>
            
            <button onClick={toggleSortOrder} className="btn-icon">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Date</th>
                <th>Score</th>
                <th>Temps passé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.studentName}</td>
                  <td>{formatDateTime(result.completedAt)}</td>
                  <td>
                    <span className={`score-badge ${result.score >= 80 ? 'high' : result.score >= 60 ? 'medium' : 'low'}`}>
                      {result.score}%
                    </span>
                  </td>
                  <td>{formatTime(result.timeSpent)}</td>
                  <td>
                    <Link to={`/professor/result-detail/${result.id}`} className="btn btn-primary">Détails</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="export-section mt-4">
        <h2>Exporter les Résultats</h2>
        <div className="export-buttons">
          <button className="btn btn-secondary">Exporter en CSV</button>
          <button className="btn btn-secondary">Exporter en PDF</button>
          <button className="btn btn-secondary">Imprimer</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalysis;