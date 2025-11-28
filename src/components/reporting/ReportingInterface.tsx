import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OHIFViewer from './OHIFViewer';
import QuestionnairePanel from './QuestionnairePanel';
import ReportPreview from './ReportPreview';

export default function ReportingInterface() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { studies, getPatientById, setCurrentAnswers } = useApp();
  const [showReport, setShowReport] = useState(false);

  const study = studies.find(s => s.id === studyId);
  const patient = study ? getPatientById(study.patientId) : null;

  useEffect(() => {
    if (!study) {
      navigate('/');
    }
  }, [study, navigate]);

  useEffect(() => {
    // Clear any previous questionnaire responses when switching studies
    setCurrentAnswers([]);
    setShowReport(false);
  }, [studyId, setCurrentAnswers]);

  if (!study || !patient) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="h-14 border-b bg-white flex items-center px-4 gap-4 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">
            {patient.firstName} {patient.lastName} - {study.modality.toUpperCase()}
          </div>
          <div className="text-xs text-gray-500">NHI: {patient.nhi}</div>
        </div>
        <Button
          variant={showReport ? 'outline' : 'default'}
          onClick={() => setShowReport(!showReport)}
        >
          {showReport ? 'Back to Questions' : 'View Report'}
        </Button>
      </div>

      {/* Two-pane layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <OHIFViewer studyId={study.id} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            {showReport ? (
              <ReportPreview study={study} patient={patient} />
            ) : (
              <QuestionnairePanel study={study} onReportGenerated={() => setShowReport(true)} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
