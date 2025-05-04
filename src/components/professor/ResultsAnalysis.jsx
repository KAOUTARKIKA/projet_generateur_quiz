// components/professor/ResultsAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Printer, 
  FileText, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  BarChart,
  Users,
  Award,
  AlertTriangle
} from 'lucide-react';

// Register Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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
  const [chartRef, setChartRef] = useState(null);

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

  useEffect(() => {
    if (!loading && chartRef) {
      // Create a performance chart
      const ctx = chartRef.getContext('2d');
      
      const scoresData = results.map(r => r.score);
      const labels = results.map(r => r.studentName);
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Score (%)',
            data: scoresData,
            backgroundColor: scoresData.map(score => 
              score >= 80 ? 'rgba(52, 211, 153, 0.8)' : 
              score >= 60 ? 'rgba(251, 191, 36, 0.8)' : 
              'rgba(239, 68, 68, 0.8)'
            ),
            borderColor: scoresData.map(score => 
              score >= 80 ? 'rgb(16, 185, 129)' : 
              score >= 60 ? 'rgb(245, 158, 11)' : 
              'rgb(220, 38, 38)'
            ),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Score: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }
  }, [loading, chartRef, results]);

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

  // Score color class
  const getScoreColorClass = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="layout-with-sidebar">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-with-sidebar results-analysis-container">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 results-header">
          <h1 className="text-3xl font-bold text-gray-800">Analyse des Résultats</h1>
          <Link 
            to="/professor/manage-quiz" 
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux Quiz
          </Link>
        </div>
        
        {quiz && (
          <div className="quiz-card bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-600 scale-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>Créé le: {quiz.createdAt}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                <span>Questions: {quiz.questionsCount}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span>Temps limite: {quiz.timeLimit} minutes</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stats-grid fade-in">
          <div className="stats-card bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Tentatives</h3>
              <div className="stats-card-icon p-2 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{statistics.attempts}</p>
            <p className="text-sm text-gray-500 mt-2">étudiants ont répondu</p>
          </div>
          
          <div className="stats-card bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Score Moyen</h3>
              <div className={`score-badge stats-card-icon p-2 rounded-full flex items-center justify-center ${getScoreColorClass(statistics.avgScore)}`}>
                <BarChart className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{statistics.avgScore.toFixed(1)}%</p>
            <div className="w-full progress-bar mt-3">
              <div 
                className={`progress-bar-fill ${getScoreColorClass(statistics.avgScore)}`} 
                style={{ width: `${statistics.avgScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="stats-card bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Score le Plus Élevé</h3>
              <div className="stats-card-icon p-2 bg-emerald-100 rounded-full">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{statistics.highestScore}%</p>
            <p className="text-sm text-gray-500 mt-2">performance maximale</p>
          </div>
          
          <div className="stats-card bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-600">Score le Plus Bas</h3>
              <div className="stats-card-icon p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{statistics.lowestScore}%</p>
            <p className="text-sm text-gray-500 mt-2">performance minimale</p>
          </div>
        </div>
        
        <div className="chart-container bg-white rounded-xl shadow-md p-6 mb-8 fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Visualisation des Scores</h2>
          <div className="aspect-video w-full">
            <canvas ref={setChartRef}></canvas>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 scale-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Performance par Question</h2>
          <div className="question-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questionStats.map((qStat) => {
              const colorClass = qStat.correctRate >= 80 
                ? 'bg-emerald-500' 
                : qStat.correctRate >= 60 
                  ? 'bg-amber-500' 
                  : 'bg-red-500';
                  
              return (
                <div className="question-card border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" key={qStat.questionId}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-700">Question {qStat.questionNumber}</h4>
                    <div className={`question-rate-badge px-2 py-1 rounded-full text-xs font-medium text-white ${colorClass}`}>
                      {qStat.correctRate}% correct
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{qStat.questionText}</p>
                  <div className="progress-bar w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`progress-bar-fill h-2 rounded-full ${colorClass}`} 
                      style={{ width: `${qStat.correctRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                      <span>{qStat.correctAnswers}/{qStat.totalAttempts}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      <span>{qStat.avgTimeSpent}s</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 scale-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Résultats des Étudiants</h2>
            <div className="flex flex-wrap gap-2">
              <select 
                value={filter} 
                onChange={handleFilterChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les résultats</option>
                <option value="high">Score élevé (≥ 80%)</option>
                <option value="medium">Score moyen (60-79%)</option>
                <option value="low">Score faible (&lt; 60%)</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Trier par date</option>
                <option value="score">Trier par score</option>
                <option value="name">Trier par nom</option>
                <option value="time">Trier par temps</option>
              </select>
              
              <button 
                onClick={toggleSortOrder} 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temps passé</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((result) => {
                  const scoreColorClass = result.score >= 80 
                    ? 'bg-emerald-500' 
                    : result.score >= 60 
                      ? 'bg-amber-500' 
                      : 'bg-red-500';
                      
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 student-result-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {result.studentName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(result.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${scoreColorClass}`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {formatTime(result.timeSpent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/professor/result-detail/${result.id}`} 
                          className="action-button text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Détails
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Exporter les Résultats</h2>
          <div className="flex flex-wrap gap-4">
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exporter en CSV
            </button>
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Exporter en PDF
            </button>
            <button className="export-button flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsAnalysis;