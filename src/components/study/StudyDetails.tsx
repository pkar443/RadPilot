import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Patient, Modality } from '@/types/radpilot';
import { Activity, Scan, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  patient: Patient;
  onComplete: (modality: Modality) => void;
}

const modalities = [
  {
    id: 'us-abdomen' as Modality,
    name: 'Abdominal Ultrasound',
    description: '40+ guided questions',
    icon: Activity,
    color: 'blue'
  },
  {
    id: 'ct-abdomen' as Modality,
    name: 'Abdominal CT',
    description: '50+ guided questions',
    icon: Scan,
    color: 'purple'
  },
  {
    id: 'chest-xray' as Modality,
    name: 'Chest X-ray',
    description: '30+ guided questions',
    icon: Stethoscope,
    color: 'green'
  }
];

export default function StudyDetails({ patient, onComplete }: Props) {
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Details</CardTitle>
        <CardDescription>
          Patient: {patient.firstName} {patient.lastName} (NHI: {patient.nhi})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Modality *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modalities.map((modality) => {
              const Icon = modality.icon;
              const isSelected = selectedModality === modality.id;
              
              return (
                <button
                  key={modality.id}
                  onClick={() => setSelectedModality(modality.id)}
                  className={cn(
                    'p-6 border-2 rounded-lg text-left transition-all hover:shadow-md',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn(
                    'h-12 w-12 rounded-lg flex items-center justify-center mb-4',
                    modality.color === 'blue' && 'bg-blue-100',
                    modality.color === 'purple' && 'bg-purple-100',
                    modality.color === 'green' && 'bg-green-100'
                  )}>
                    <Icon className={cn(
                      'h-6 w-6',
                      modality.color === 'blue' && 'text-blue-600',
                      modality.color === 'purple' && 'text-purple-600',
                      modality.color === 'green' && 'text-green-600'
                    )} />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">{modality.name}</div>
                  <div className="text-sm text-gray-500">{modality.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={() => selectedModality && onComplete(selectedModality)}
          disabled={!selectedModality}
        >
          Continue to Image Upload
        </Button>
      </CardContent>
    </Card>
  );
}
