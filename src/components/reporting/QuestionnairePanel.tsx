import { useState, useEffect } from 'react';
import { Study, Question, QuestionAnswer } from '@/types/radpilot';
import { getQuestionsForModality } from '@/data/questions';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import QuestionInput from './QuestionInput';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  study: Study;
  onReportGenerated: () => void;
}

export default function QuestionnairePanel({ study, onReportGenerated }: Props) {
  const { currentAnswers, setCurrentAnswers } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions] = useState<Question[]>(getQuestionsForModality(study.modality));

  // Filter questions based on conditional logic
  const visibleQuestions = allQuestions.filter(q => {
    if (!q.conditionalOn) return true;
    const dependentAnswer = currentAnswers.find(a => a.questionId === q.conditionalOn!.questionId);
    return dependentAnswer && dependentAnswer.value === q.conditionalOn.value;
  });

  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const currentAnswer = currentAnswers.find(a => a.questionId === currentQuestion?.id);

  // Group questions by section
  const sections = Array.from(new Set(visibleQuestions.map(q => q.section)));
  const progress = (currentQuestionIndex / visibleQuestions.length) * 100;

  const handleAnswer = (value: string | number | boolean | string[]) => {
    const newAnswers = currentAnswers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, value });
    setCurrentAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered
      onReportGenerated();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const isAnswered = currentAnswer !== undefined;
  const answeredCount = visibleQuestions.filter(q => 
    currentAnswers.some(a => a.questionId === q.id)
  ).length;

  useEffect(() => {
    // Reset the wizard position whenever the study or visible question set changes
    setCurrentQuestionIndex(0);
  }, [study.id, visibleQuestions.length]);

  if (!currentQuestion) {
    return <div className="p-6">Loading questions...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-900">
            Question {currentQuestionIndex + 1} of {visibleQuestions.length}
          </div>
          <div className="text-sm text-gray-500">
            {answeredCount} answered
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Section Navigation */}
        <div className="w-64 bg-white border-r flex-shrink-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 mb-3">SECTIONS</div>
              <Accordion type="single" collapsible className="space-y-1">
                {sections.map((section, sectionIndex) => {
                  const sectionQuestions = visibleQuestions.filter(q => q.section === section);
                  const sectionAnswered = sectionQuestions.filter(q => 
                    currentAnswers.some(a => a.questionId === q.id)
                  ).length;
                  
                  return (
                    <AccordionItem key={section} value={section} className="border-none">
                      <AccordionTrigger className="text-sm py-2 hover:no-underline">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="flex-1 text-left">{section}</span>
                          <span className="text-xs text-gray-500">
                            {sectionAnswered}/{sectionQuestions.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 pl-2">
                          {sectionQuestions.map((q, idx) => {
                            const qIndex = visibleQuestions.indexOf(q);
                            const isAnswered = currentAnswers.some(a => a.questionId === q.id);
                            const isCurrent = qIndex === currentQuestionIndex;
                            
                            return (
                              <button
                                key={q.id}
                                onClick={() => jumpToQuestion(qIndex)}
                                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center gap-2 ${
                                  isCurrent ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {isAnswered && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                                <span className="flex-1 truncate">Q{qIndex + 1}</span>
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </ScrollArea>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              <div>
                <div className="text-xs font-semibold text-blue-600 mb-2">
                  {currentQuestion.section}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {currentQuestion.text}
                  {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
              </div>

              <QuestionInput
                question={currentQuestion}
                value={currentAnswer?.value}
                onChange={handleAnswer}
              />
            </div>
          </ScrollArea>

          {/* Navigation Footer */}
          <div className="border-t bg-white p-4 flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentQuestion.required && !isAnswered}
              className="flex-1"
            >
              {currentQuestionIndex === visibleQuestions.length - 1 ? 'Generate Report' : 'Next'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
