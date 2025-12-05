import React, { useState, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { PreviewScreen } from './components/PreviewScreen';
import { generateFullGameQuestions } from './services/geminiService';
import { GameState, QuizQuestion } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoadQuestions = useCallback(async () => {
    try {
      setGameState(GameState.LOADING);
      setErrorMsg(null);
      
      // Fetch 60 questions in batches (Easy, Medium, Hard)
      const fetchedQuestions = await generateFullGameQuestions();
      
      setQuestions(fetchedQuestions);
      // Go to PREVIEW instead of PLAYING directly
      setGameState(GameState.PREVIEW);
    } catch (error) {
      console.error(error);
      setGameState(GameState.ERROR);
      setErrorMsg("Impossibile caricare le domande. Controlla la tua API Key o riprova.");
    }
  }, []);

  const handleConfirmStart = () => {
    setGameState(GameState.PLAYING);
  };

  const handleUpdateQuestions = (updatedQuestions: QuizQuestion[]) => {
    setQuestions(updatedQuestions);
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.FINISHED);
  };

  const handleRestart = () => {
    setScore(0);
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header / Brand for Live Stream Visibility */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
        <div className="font-black text-2xl tracking-tighter text-white/50">
          SPAZIONAPOLI <span className="text-white">LIVE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col relative z-20 container mx-auto px-4 py-12 h-screen">
        
        {gameState === GameState.MENU && (
          <WelcomeScreen onStart={handleLoadQuestions} />
        )}

        {gameState === GameState.LOADING && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-20 h-20 border-8 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-black animate-pulse">GENERAZIONE PARTITA...</h2>
            <p className="text-blue-200 mt-4 text-xl">Recupero 60 domande dal database storico (può richiedere qualche secondo)</p>
          </div>
        )}

        {gameState === GameState.PREVIEW && (
          <PreviewScreen 
            questions={questions} 
            onConfirm={handleConfirmStart}
            onRegenerate={handleLoadQuestions}
            onUpdateQuestions={handleUpdateQuestions}
          />
        )}

        {gameState === GameState.PLAYING && (
          <QuizScreen 
            questions={questions} 
            onComplete={handleQuizComplete} 
          />
        )}

        {gameState === GameState.FINISHED && (
          <ResultScreen 
            score={score} 
            total={questions.length} 
            onRestart={handleRestart} 
          />
        )}

        {gameState === GameState.ERROR && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-red-500/90 text-white p-8 rounded-2xl max-w-md shadow-xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold mb-2">Errore Tecnico</h3>
              <p className="mb-6">{errorMsg || "Qualcosa è andato storto."}</p>
              <button 
                onClick={handleRestart}
                className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Torna al Menu
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;