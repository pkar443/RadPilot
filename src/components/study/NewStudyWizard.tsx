import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PatientSelection from './PatientSelection';
import StudyDetails from './StudyDetails';
import ImageUpload from './ImageUpload';
import { Patient, Study, Modality } from '@/types/radpilot';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type Step = 'patient' | 'study' | 'images';

export default function NewStudyWizard() {
  const [currentStep, setCurrentStep] = useState<Step>('patient');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);
  const { addStudy, setCurrentStudy } = useApp();
  const navigate = useNavigate();

  const steps = [
    { id: 'patient', label: 'Patient Selection', description: 'Select or create patient' },
    { id: 'study', label: 'Study Details', description: 'Choose modality and details' },
    { id: 'images', label: 'Image Upload', description: 'Upload DICOM or images' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handlePatientSelected = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentStep('study');
  };

  const handleStudyDetailsComplete = (modality: Modality) => {
    setSelectedModality(modality);
    setCurrentStep('images');
  };

  const handleImagesUploaded = () => {
    if (selectedPatient && selectedModality) {
      const newStudy: Study = {
        id: `s${Date.now()}`,
        patientId: selectedPatient.id,
        modality: selectedModality,
        studyDate: new Date().toISOString(),
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addStudy(newStudy);
      setCurrentStudy(newStudy);
      navigate(`/reporting/${newStudy.id}`);
    }
  };

  const handleBack = () => {
    if (currentStep === 'study') {
      setCurrentStep('patient');
    } else if (currentStep === 'images') {
      setCurrentStep('study');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">New Study</h1>
          <p className="text-gray-600">Create a new radiology study</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              {steps.map((step, index) => (
                <div key={step.id} className={`flex-1 ${index < steps.length - 1 ? 'pr-4' : ''}`}>
                  <div className={`font-medium ${currentStepIndex >= index ? 'text-blue-600' : 'text-gray-400'}`}>
                    Step {index + 1}
                  </div>
                  <div className={`text-xs ${currentStepIndex >= index ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'patient' && (
        <PatientSelection onPatientSelected={handlePatientSelected} />
      )}

      {currentStep === 'study' && selectedPatient && (
        <StudyDetails 
          patient={selectedPatient} 
          onComplete={handleStudyDetailsComplete}
        />
      )}

      {currentStep === 'images' && selectedModality && (
        <ImageUpload 
          modality={selectedModality}
          onComplete={handleImagesUploaded}
        />
      )}
    </div>
  );
}
