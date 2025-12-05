import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Button } from './Button';

interface PreviewScreenProps {
  questions: QuizQuestion[];
  onConfirm: () => void;
  onRegenerate: () => void;
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ questions, onConfirm, onRegenerate, onUpdateQuestions }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempQuestion, setTempQuestion] = useState<QuizQuestion | null>(null);

  const handleEditClick = (index: number) => {
    setEditingId(index);
    // Deep copy to avoid mutating state directly during edits
    setTempQuestion({
      ...questions[index],
      options: [...questions[index].options]
    });
  };

  const handleSave = () => {
    if (editingId !== null && tempQuestion) {
      const newQuestions = [...questions];
      newQuestions[editingId] = tempQuestion;
      onUpdateQuestions(newQuestions);
      setEditingId(null);
      setTempQuestion(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempQuestion(null);
  };

  const handleOptionChange = (idx: number, newVal: string) => {
    if (!tempQuestion) return;
    const newOptions = [...tempQuestion.options];
    const oldVal = newOptions[idx];
    newOptions[idx] = newVal;
    
    // If we changed the text of the correct answer, update the correct answer string too
    let newCorrect = tempQuestion.correctAnswer;
    if (tempQuestion.correctAnswer === oldVal) {
        newCorrect = newVal;
    }
    
    setTempQuestion({
        ...tempQuestion,
        options: newOptions,
        correctAnswer: newCorrect
    });
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full p-6 animate-fade-in relative z-30">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-black text-white">ANTEPRIMA LIVE</h2>
          <p className="text-blue-200">Verifica la scaletta delle domande prima di andare in onda.</p>
        </div>
        <div className="text-right">
           <span className="bg-white/20 px-4 py-2 rounded-lg font-bold text-white border border-white/20 shadow-lg">
             {questions.length} Domande Generate
           </span>
        </div>
      </div>

      <div className="flex-grow overflow-auto glass-panel rounded-3xl p-0 shadow-2xl mb-6 relative border border-white/30">
         <table className="w-full text-left border-collapse">
            <thead className="bg-napoli-dark text-white sticky top-0 z-10 shadow-md">
              <tr>
                <th className="p-4 font-bold w-16 text-center">#</th>
                <th className="p-4 font-bold">Domanda</th>
                <th className="p-4 font-bold text-green-300">Risposta Corretta</th>
                <th className="p-4 font-bold w-32 text-center">Difficoltà</th>
                <th className="p-4 font-bold w-16 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white/90">
              {questions.map((q, idx) => {
                let diff = "MEDIO";
                let badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
                
                if (idx >= 20) { 
                  diff = "DIFFICILE"; 
                  badgeClass = "bg-red-100 text-red-700 border-red-200"; 
                }

                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50 transition-colors text-gray-800">
                    <td className="p-4 font-mono text-gray-500 text-center font-bold">{idx + 1}</td>
                    <td className="p-4 font-medium text-lg leading-snug">{q.question}</td>
                    <td className="p-4 text-napoli-dark font-bold">{q.correctAnswer}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-black tracking-wider uppercase border ${badgeClass}`}>
                        {diff}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleEditClick(idx)}
                        className="p-2 text-gray-500 hover:text-napoli hover:bg-blue-50 rounded-full transition-colors"
                        title="Modifica Domanda"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
         </table>
      </div>

      <div className="flex justify-between gap-4 p-4 glass-panel rounded-2xl">
        <Button onClick={onRegenerate} variant="secondary" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Rigenera Scaletta
        </Button>
        <Button onClick={onConfirm} variant="primary" className="px-12 flex items-center gap-2 text-xl shadow-blue-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          AVVIA LIVE
        </Button>
      </div>

      {/* Edit Modal */}
      {editingId !== null && tempQuestion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-3xl">
              <h3 className="text-2xl font-bold text-gray-800">Modifica Domanda #{editingId + 1}</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Testo Domanda</label>
                <textarea 
                  value={tempQuestion.question}
                  onChange={(e) => setTempQuestion({...tempQuestion, question: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-napoli focus:border-transparent text-lg font-medium text-gray-800 min-h-[100px]"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Opzioni (Seleziona la corretta)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tempQuestion.options.map((opt, idx) => (
                    <div key={idx} className={`flex items-center p-3 rounded-xl border-2 transition-all ${tempQuestion.correctAnswer === opt ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                      <input 
                        type="radio" 
                        name="correctAnswer"
                        checked={tempQuestion.correctAnswer === opt}
                        onChange={() => setTempQuestion({...tempQuestion, correctAnswer: opt})}
                        className="w-5 h-5 text-green-600 focus:ring-green-500 mr-3 cursor-pointer"
                      />
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-grow bg-transparent border-none focus:ring-0 text-gray-800 font-medium"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Spiegazione / Curiosità</label>
                <textarea 
                  value={tempQuestion.explanation}
                  onChange={(e) => setTempQuestion({...tempQuestion, explanation: e.target.value})}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-napoli focus:border-transparent text-gray-700"
                  rows={3}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end gap-3">
              <button 
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Annulla
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3 rounded-xl font-bold text-white bg-napoli hover:bg-napoli-dark shadow-lg transition-transform hover:scale-[1.02]"
              >
                Salva Modifiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};