import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Study, Report, QuestionAnswer, Radiologist } from '@/types/radpilot';

interface AppContextType {
  currentUser: Radiologist;
  patients: Patient[];
  studies: Study[];
  reports: Report[];
  currentStudy: Study | null;
  currentAnswers: QuestionAnswer[];
  setCurrentStudy: (study: Study | null) => void;
  setCurrentAnswers: (answers: QuestionAnswer[]) => void;
  addPatient: (patient: Patient) => void;
  addStudy: (study: Study) => void;
  updateStudy: (studyId: string, updates: Partial<Study>) => void;
  addReport: (report: Report) => void;
  updateReport: (reportId: string, updates: Partial<Report>) => void;
  getPatientById: (id: string) => Patient | undefined;
  getStudiesByPatientId: (patientId: string) => Study[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data
const mockRadiologist: Radiologist = {
  id: '1',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@alloydx.ai',
  role: 'Consultant Radiologist',
  initials: 'SC'
};

const mockPatients: Patient[] = [
  {
    id: 'p1',
    nhi: 'ABC1234',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1975-06-15',
    gender: 'male',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    nhi: 'DEF5678',
    firstName: 'Emma',
    lastName: 'Johnson',
    dateOfBirth: '1988-03-22',
    gender: 'female',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    nhi: 'GHI9012',
    firstName: 'Michael',
    lastName: 'Williams',
    dateOfBirth: '1962-11-08',
    gender: 'male',
    createdAt: new Date().toISOString()
  }
];

const mockStudies: Study[] = [
  {
    id: 's1',
    patientId: 'p1',
    modality: 'us-abdomen',
    studyDate: new Date().toISOString(),
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 's2',
    patientId: 'p2',
    modality: 'ct-abdomen',
    studyDate: new Date().toISOString(),
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser] = useState<Radiologist>(mockRadiologist);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [studies, setStudies] = useState<Study[]>(mockStudies);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentStudy, setCurrentStudy] = useState<Study | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<QuestionAnswer[]>([]);

  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };

  const addStudy = (study: Study) => {
    setStudies(prev => [...prev, study]);
  };

  const updateStudy = (studyId: string, updates: Partial<Study>) => {
    setStudies(prev => prev.map(s => s.id === studyId ? { ...s, ...updates } : s));
  };

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
  };

  const updateReport = (reportId: string, updates: Partial<Report>) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updates } : r));
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const getStudiesByPatientId = (patientId: string) => {
    return studies.filter(s => s.patientId === patientId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        patients,
        studies,
        reports,
        currentStudy,
        currentAnswers,
        setCurrentStudy,
        setCurrentAnswers,
        addPatient,
        addStudy,
        updateStudy,
        addReport,
        updateReport,
        getPatientById,
        getStudiesByPatientId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
