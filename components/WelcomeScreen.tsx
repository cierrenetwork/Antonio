import React from 'react';
import { Button } from './Button';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
      <div className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-sm shadow-2xl border border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-6xl font-black mb-4 tracking-tight drop-shadow-md">
        QUIZ <span className="text-white">SPAZIONAPOLI</span>
      </h1>
      
      <p className="text-2xl text-blue-100 mb-12 max-w-2xl font-light">
        Sfida la community! Dimostra di essere il vero tifoso numero 1.
      </p>

      <div className="glass-panel p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-6 text-napoli-dark">Pronto a scendere in campo?</h3>
        <Button onClick={onStart} fullWidth variant="primary">
          INIZIA IL QUIZ
        </Button>
      </div>
    </div>
  );
};