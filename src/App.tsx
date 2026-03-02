import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { QUESTIONS, VOLUNTEER_TYPES } from './constants';

type Step = 'START' | 'QUESTION' | 'RESULT';

export default function App() {
  const [step, setStep] = useState<Step>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const handleStart = () => {
    setStep('QUESTION');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setResultIndex(null);
  };

  const handleAnswer = (answer: number) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (answers: number[]) => {
    let maxScore = -1;
    let bestMatchIndex = 0;

    VOLUNTEER_TYPES.forEach((volunteer, index) => {
      let score = 0;
      for (let i = 0; i < answers.length; i++) {
        if (volunteer.answers[i] === answers[i]) {
          score++;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatchIndex = index;
      }
    });

    setResultIndex(bestMatchIndex);
    setStep('RESULT');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          {step === 'START' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center border border-stone-100"
            >
              <div className="text-emerald-600 font-bold text-sm tracking-widest mb-4 uppercase">
                인하대 중앙봉사동아리 엘레펀트
              </div>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🐘
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-stone-800 mb-4">
                나에게 맞는<br />봉사메이트 찾기
              </h1>
              <p className="text-stone-500 mb-10 leading-relaxed">
                10가지 간단한 질문에 답하고<br />
                나의 성향에 딱 맞는 봉사메이트를 찾아보세요!
              </p>
              <button
                onClick={handleStart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                테스트 시작하기
                <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 'QUESTION' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-stone-100"
            >
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Q {currentQuestionIndex + 1} / {QUESTIONS.length}
                  </span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: `${(currentQuestionIndex / QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-10 text-stone-800 leading-tight">
                어떤 봉사가<br />더 끌리시나요?
              </h2>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleAnswer(1)}
                  className="w-full bg-stone-50 hover:bg-emerald-50 border-2 border-stone-100 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 font-medium py-5 px-6 rounded-2xl transition-all active:scale-[0.98] text-lg text-center shadow-sm"
                >
                  {QUESTIONS[currentQuestionIndex].option1}
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="w-full bg-stone-50 hover:bg-emerald-50 border-2 border-stone-100 hover:border-emerald-500 text-stone-700 hover:text-emerald-700 font-medium py-5 px-6 rounded-2xl transition-all active:scale-[0.98] text-lg text-center shadow-sm"
                >
                  {QUESTIONS[currentQuestionIndex].option0}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'RESULT' && resultIndex !== null && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center border border-stone-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              
              <p className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wider">
                당신에게 딱 맞는 봉사유형은
              </p>
              
              <div className="text-6xl mb-4">
                {VOLUNTEER_TYPES[resultIndex].emoji}
              </div>
              
              <h2 className="text-3xl font-bold text-stone-800 mb-6">
                {VOLUNTEER_TYPES[resultIndex].name}
              </h2>
              
              <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
                <p className="text-stone-600 leading-relaxed mb-4">
                  {VOLUNTEER_TYPES[resultIndex].description}
                </p>
                <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl text-sm font-medium">
                  이제 운영진에게 결과를 보여주고<br />봉사메이트를 기다려보세요! 🐘
                </div>
              </div>

              <button
                onClick={handleStart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 px-8 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                다시 테스트하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
