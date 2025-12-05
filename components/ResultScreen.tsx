import React from 'react';
import { Button } from './Button';

interface ResultScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, onRestart }) => {
  const percentage = (score / total) * 100;
  
  let title = "";
  let message = "";
  let emoji = "";

  if (percentage === 100) {
    title = "CAMPIONE D'ITALIA! 🏆";
    message = "Incredibile! Conosci il Napoli meglio di Aurelio De Laurentiis!";
    emoji = "⭐";
  } else if (percentage >= 80) {
    title = "Zona Champions! ⚽";
    message = "Ottimo risultato! Sei un vero esperto azzurro.";
    emoji = "🇪🇺";
  } else if (percentage >= 50) {
    title = "Metà Classifica";
    message = "Non male, ma serve un po' più di allenamento a Castel Volturno.";
    emoji = "💪";
  } else {
    title = "Zona Retrocessione 📉";
    message = "Ahi ahi! Ripassa la storia e torna più forte!";
    emoji = "🚑";
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in max-w-4xl mx-auto">
      <div className="glass-panel p-12 rounded-[3rem] shadow-2xl w-full">
        <div className="text-8xl mb-6">{emoji}</div>
        
        <h2 className="text-5xl font-black text-napoli-dark mb-4">{title}</h2>
        
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-napoli to-blue-600 mb-6">
          {score}/{total}
        </div>
        
        <p className="text-2xl text-gray-600 mb-12 font-medium">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <Button onClick={onRestart} variant="primary" className="min-w-[200px]">
            Gioca Ancora 🔄
          </Button>
        </div>
      </div>
    </div>
  );
};