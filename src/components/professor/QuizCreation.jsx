// components/professor/QuizCreation.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizCreation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    isPublic: true,
    questions: []
  });
  
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple_choice',
    points: 1,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });
  
  // Handle quiz information changes
  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuiz({
      ...quiz,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle current question changes
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value
    });
  };
  
  // Handle option changes
  const handleOptionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedOptions = [...currentQuestion.options];
    
    if (type === 'checkbox') {
      // For multiple choice, only one can be correct
      if (currentQuestion.type === 'multiple_choice' && checked) {
        updatedOptions.forEach(option => option.isCorrect = false);
      }
      updatedOptions[index] = {
        ...updatedOptions[index],
        isCorrect: checked
      };
    } else {
      updatedOptions[index] = {
        ...updatedOptions[index],
        [name]: value
      };
    }
    
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };
  
  // Add option to current question
  const addOption = () => {
    if (currentQuestion.options.length < 8) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [
          ...currentQuestion.options,
          { text: '', isCorrect: false }
        ]
      });
    }
  };
  
  // Remove option from current question
  const removeOption = (index) => {
    if (currentQuestion.options.length > 2) {
      const updatedOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({
        ...currentQuestion,
        options: updatedOptions
      });
    }
  };
  
  // Add current question to quiz
  const addQuestion = () => {
    // Validate question first
    let valid = currentQuestion.text.trim() !== '';
    let hasCorrectAnswer = currentQuestion.options.some(option => option.isCorrect);
    
    if (!valid || !hasCorrectAnswer) {
      alert('Veuillez compléter la question et marquer au moins une réponse comme correcte.');
      return;
    }
    
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { ...currentQuestion, id: Date.now() }]
    });
    
    // Reset current question
    setCurrentQuestion({
      text: '',
      type: 'multiple_choice',
      points: 1,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    });
  };
  
  // Edit existing question
  const editQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]);
    // Remove the question from the list
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  // Remove question from quiz
  const removeQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate quiz info
      if (!quiz.title.trim()) {
        alert('Veuillez donner un titre à votre quiz.');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Save quiz
  const saveQuiz = () => {
    // This would be an API call in a real application
    console.log('Quiz saved:', quiz);
    
    // Mock saving process
    setTimeout(() => {
      alert('Quiz créé avec succès!');
      navigate('/professor/manage-quiz');
    }, 1000);
  };
  
  return (
    <div className="content-area">
      <h1>Créer un Nouveau Quiz</h1>
      
      {/* Step indicator */}
      <div className="stepper mb-4">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Informations du Quiz</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Ajouter des Questions</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Récapitulatif</div>
        </div>
      </div>
      
      {/* Step 1: Quiz Information */}
      {currentStep === 1 && (
        <div className="quiz-info">
          <div className="form-group">
            <label htmlFor="title">Titre du Quiz</label>
            <input
              type="text"
              id="title"
              name="title"
              value={quiz.title}
              onChange={handleQuizChange}
              placeholder="Entrez le titre du quiz"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={quiz.description}
              onChange={handleQuizChange}
              placeholder="Entrez une description pour votre quiz"
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeLimit">Temps limite (en minutes)</label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={quiz.timeLimit}
              onChange={handleQuizChange}
              min="1"
              max="180"
            />
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={quiz.isPublic}
                onChange={handleQuizChange}
              />
              Rendre ce quiz public pour tous les étudiants
            </label>
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" onClick={nextStep}>Continuer</button>
          </div>
        </div>
      )}
      
      {/* Step 2: Add Questions */}
      {currentStep === 2 && (
        <div className="quiz-questions">
          <div className="question-form">
            <h2>Ajouter une Question</h2>
            
            <div className="form-group">
              <label htmlFor="questionText">Question</label>
              <textarea
                id="questionText"
                name="text"
                value={currentQuestion.text}
                onChange={handleQuestionChange}
                placeholder="Entrez votre question"
                rows="2"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="questionType">Type de Question</label>
              <select
                id="questionType"
                name="type"
                value={currentQuestion.type}
                onChange={handleQuestionChange}
              >
                <option value="multiple_choice">Choix Multiple (une réponse)</option>
                <option value="checkbox">Cases à Cocher (plusieurs réponses)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="points">Points</label>
              <input
                type="number"
                id="points"
                name="points"
                value={currentQuestion.points}
                onChange={handleQuestionChange}
                min="1"
                max="10"
              />
            </div>
            
            <h3>Options</h3>
            {currentQuestion.options.map((option, index) => (
              <div className="option-row" key={index}>
                <div className="form-group">
                  <input
                    type="text"
                    name="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type={currentQuestion.type === 'multiple_choice' ? 'radio' : 'checkbox'}
                      name="isCorrect"
                      checked={option.isCorrect}
                      onChange={(e) => handleOptionChange(index, e)}
                    />
                    Correcte
                  </label>
                </div>
                
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => removeOption(index)}
                  disabled={currentQuestion.options.length <= 2}
                >
                  Supprimer
                </button>
              </div>
            ))}
            
            <div className="form-group">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={addOption}
                disabled={currentQuestion.options.length >= 8}
              >
                + Ajouter une option
              </button>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn btn-success" onClick={addQuestion}>
                Ajouter la Question
              </button>
            </div>
          </div>
          
          <div className="questions-list mt-4">
            <h2>Questions ({quiz.questions.length})</h2>
            {quiz.questions.length === 0 ? (
              <p>Aucune question ajoutée. Ajoutez au moins une question.</p>
            ) : (
              <div className="question-cards">
                {quiz.questions.map((question, index) => (
                  <div className="card" key={index}>
                    <div className="card-header">
                      <h3 className="card-title">Question {index + 1}</h3>
                      <div className="card-actions">
                        <button className="btn btn-secondary" onClick={() => editQuestion(index)}>Éditer</button>
                        <button className="btn btn-danger" onClick={() => removeQuestion(index)}>Supprimer</button>
                      </div>
                    </div>
                    <div className="card-content">
                      <p>{question.text}</p>
                      <div className="options-list">
                        <strong>Options:</strong>
                        <ul>
                          {question.options.map((option, optIndex) => (
                            <li key={optIndex} className={option.isCorrect ? 'correct-option' : ''}>
                              {option.text} {option.isCorrect && '✓'}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="question-meta">
                        <span>Type: {question.type === 'multiple_choice' ? 'Choix Multiple' : 'Cases à Cocher'}</span>
                        <span>Points: {question.points}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-actions mt-4">
            <button className="btn btn-secondary" onClick={prevStep}>Retour</button>
            <button 
              className="btn btn-primary" 
              onClick={nextStep}
              disabled={quiz.questions.length === 0}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Quiz Summary */}
      {currentStep === 3 && (
        <div className="quiz-summary">
          <h2>Récapitulatif du Quiz</h2>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Informations Générales</h3>
            </div>
            <div className="card-content">
              <p><strong>Titre:</strong> {quiz.title}</p>
              <p><strong>Description:</strong> {quiz.description || 'Aucune description'}</p>
              <p><strong>Temps Limite:</strong> {quiz.timeLimit} minutes</p>
              <p><strong>Statut:</strong> {quiz.isPublic ? 'Public' : 'Privé'}</p>
              <p><strong>Nombre de Questions:</strong> {quiz.questions.length}</p>
              <p><strong>Points Totaux:</strong> {quiz.questions.reduce((sum, q) => sum + parseInt(q.points), 0)}</p>
            </div>
          </div>
          
          <h3 className="mt-4">Questions ({quiz.questions.length})</h3>
          <div className="accordion">
            {quiz.questions.map((question, index) => (
              <div className="accordion-item" key={index}>
                <div className="accordion-header">
                  <h4>Question {index + 1}: {question.text.slice(0, 50)}...</h4>
                </div>
                <div className="accordion-content">
                  <p><strong>Question:</strong> {question.text}</p>
                  <p><strong>Type:</strong> {question.type === 'multiple_choice' ? 'Choix Multiple' : 'Cases à Cocher'}</p>
                  <p><strong>Points:</strong> {question.points}</p>
                  <div className="options-list">
                    <strong>Options:</strong>
                    <ul>
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className={option.isCorrect ? 'correct-option' : ''}>
                          {option.text} {option.isCorrect && '✓'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="form-actions mt-4">
            <button className="btn btn-secondary" onClick={prevStep}>Retour</button>
            <button className="btn btn-success" onClick={saveQuiz}>Créer le Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizCreation;