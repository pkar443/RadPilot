export type Modality = 'us-abdomen' | 'ct-abdomen' | 'chest-xray';

export interface Patient {
  id: string;
  nhi: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  createdAt: string;
}

export interface Study {
  id: string;
  patientId: string;
  modality: Modality;
  studyDate: string;
  status: 'draft' | 'in-progress' | 'completed';
  reportId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAnswer {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface Report {
  id: string;
  studyId: string;
  technique: string;
  findings: string;
  impression: string;
  status: 'draft' | 'finalized';
  radiologistId?: string;
  radiologistName?: string;
  finalizedAt?: string;
  qrCodeUrl?: string;
}

export interface Question {
  id: string;
  section: string;
  text: string;
  type: 'radio' | 'dropdown' | 'numeric' | 'text' | 'textarea';
  options?: string[];
  required: boolean;
  conditionalOn?: {
    questionId: string;
    value: string | number | boolean;
  };
  unit?: string;
}

export interface Radiologist {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}
