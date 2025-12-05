import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../types';
import { Button } from './Button';
import confetti from 'canvas-confetti';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

const QUESTION_TIMEOUT = 30; // seconds

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMEOUT);

  const currentQuestion = questions[currentIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRevealed) return; // Stop timer if answered

    setTimeLeft(QUESTION_TIMEOUT);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isRevealed]);

  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRevealed(true);
    setSelectedOption(null); // No option selected means "Time's Up"
  };

  const handleOptionSelect = (option: string) => {
    if (isRevealed) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(option);
    setIsRevealed(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      // Confetti effect for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#12A0D7', '#00ff00']
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      onComplete(score, questions.length);
    }
  };

  // Prevent playing if no questions
  if (!currentQuestion) return <div>Caricamento errore...</div>;

  // Difficulty label based on new distribution: 20 Medium, 40 Hard
  let difficultyLabel = "MEDIO";
  let difficultyColor = "bg-yellow-500";
  
  if (currentIndex >= 20) {
    difficultyLabel = "DIFFICILE";
    difficultyColor = "bg-red-500";
  }

  const timerPercentage = (timeLeft / QUESTION_TIMEOUT) * 100;
  const timerColor = timeLeft < 10 ? 'bg-red-500' : timeLeft < 20 ? 'bg-yellow-400' : 'bg-green-400';

  return (
    <div className="flex flex-col items-center justify-center min-h-full max-w-5xl mx-auto w-full p-6">
      
      {/* Top Header: Count, Difficulty, Score */}
      <div className="w-full flex justify-between items-center mb-4 text-white font-semibold text-lg">
        <div className="flex items-center gap-3">
          <span className="bg-white/10 px-3 py-1 rounded-lg">
            Domanda {currentIndex + 1} / {questions.length}
          </span>
          <span className={`${difficultyColor} px-3 py-1 rounded-lg text-xs font-black tracking-widest shadow-lg`}>
            {difficultyLabel}
          </span>
        </div>
        <span className="bg-white/20 px-4 py-1 rounded-full border border-white/20">
          Punti: {score}
        </span>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-4 bg-gray-900/50 rounded-full mb-8 overflow-hidden relative border border-white/10">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
          style={{ width: `${timerPercentage}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-shadow">
          {timeLeft}s
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel w-full p-8 md:p-10 rounded-3xl shadow-2xl mb-8 text-napoli-dark relative overflow-hidden">
        {timeLeft === 0 && !selectedOption && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/90 z-10 backdrop-blur-sm animate-fade-in">
             <h2 className="text-5xl font-black text-white">TEMPO SCADUTO! ⏰</h2>
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        {currentQuestion.options.map((option, idx) => {
          let buttonStyle = "bg-white/90 text-napoli-dark hover:bg-white border-2 border-transparent"; // Default
          
          if (isRevealed) {
            if (option === currentQuestion.correctAnswer) {
              buttonStyle = "bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-[1.02]";
            } else if (option === selectedOption) {
              buttonStyle = "bg-red-500 text-white border-red-400 opacity-90";
            } else {
              buttonStyle = "bg-white/50 text-gray-500 opacity-50 cursor-not-allowed";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={isRevealed}
              className={`
                p-6 rounded-2xl text-left text-xl font-bold transition-all duration-300 shadow-lg flex items-center
                ${buttonStyle}
              `}
            >
               <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/10 mr-4 text-sm shrink-0">
                 {String.fromCharCode(65 + idx)}
               </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Button Area */}
      {isRevealed && (
        <div className="w-full animate-fade-in-up">
          <div className="bg-white/10 border-l-4 border-yellow-400 p-6 rounded-r-xl mb-8 backdrop-blur-md">
            <h4 className="text-yellow-300 font-bold uppercase text-sm tracking-wider mb-1">Lo Sapevi?</h4>
            <p className="text-white text-lg">{currentQuestion.explanation}</p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleNext} variant="primary" className="text-xl px-12 py-4 shadow-xl shadow-blue-900/50">
              {currentIndex === questions.length - 1 ? 'Vedi Risultati' : 'Prossima Domanda →'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};