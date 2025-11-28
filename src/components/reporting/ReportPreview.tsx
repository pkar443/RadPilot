import { useState } from 'react';
import { Study, Patient, Report } from '@/types/radpilot';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileText, Download, RefreshCw, Save, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  study: Study;
  patient: Patient;
}

export default function ReportPreview({ study, patient }: Props) {
  const { currentUser, currentAnswers, addReport, updateStudy } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [report, setReport] = useState<Report>({
    id: `r${Date.now()}`,
    studyId: study.id,
    technique: generateTechnique(study.modality),
    findings: generateFindings(currentAnswers),
    impression: generateImpression(currentAnswers),
    status: 'draft',
  });

  const handleRegenerate = () => {
    setReport({
      ...report,
      technique: generateTechnique(study.modality),
      findings: generateFindings(currentAnswers),
      impression: generateImpression(currentAnswers),
    });
  };

  const handleSaveDraft = () => {
    addReport(report);
    updateStudy(study.id, { status: 'in-progress', reportId: report.id });
  };

  const handleFinalize = () => {
    const finalizedReport: Report = {
      ...report,
      status: 'finalized',
      radiologistId: currentUser.id,
      radiologistName: currentUser.name,
      finalizedAt: new Date().toISOString(),
      qrCodeUrl: `https://alloydx.ai/reports/${report.id}/qr`
    };
    
    addReport(finalizedReport);
    updateStudy(study.id, { status: 'completed', reportId: finalizedReport.id });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Report Preview</h2>
            <p className="text-xs text-gray-500">
              {report.status === 'finalized' ? 'Finalized' : 'Draft'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <ScrollArea className="flex-1">
        <div className="p-8 max-w-4xl mx-auto space-y-6">
          {/* Report Header */}
          <div className="border-b pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">AlloyDX.ai</div>
                <div className="text-sm text-gray-600">Radiology Report</div>
              </div>
              {report.status === 'finalized' && (
                <div className="text-right">
                  <div className="text-xs text-gray-500">Report ID</div>
                  <div className="font-mono text-sm">{report.id}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700">Patient Information</div>
                <div className="mt-2 space-y-1">
                  <div><span className="text-gray-500">Name:</span> {patient.firstName} {patient.lastName}</div>
                  <div><span className="text-gray-500">NHI:</span> {patient.nhi}</div>
                  <div><span className="text-gray-500">DOB:</span> {patient.dateOfBirth}</div>
                  <div><span className="text-gray-500">Gender:</span> {patient.gender}</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Study Information</div>
                <div className="mt-2 space-y-1">
                  <div><span className="text-gray-500">Study Date:</span> {format(new Date(study.studyDate), 'dd MMM yyyy')}</div>
                  <div><span className="text-gray-500">Modality:</span> {study.modality.toUpperCase()}</div>
                  <div><span className="text-gray-500">Study ID:</span> {study.id}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technique */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">TECHNIQUE</h3>
            {isEditing ? (
              <Textarea
                value={report.technique}
                onChange={(e) => setReport({ ...report, technique: e.target.value })}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{report.technique}</p>
            )}
          </div>

          {/* Findings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">FINDINGS</h3>
            {isEditing ? (
              <Textarea
                value={report.findings}
                onChange={(e) => setReport({ ...report, findings: e.target.value })}
                className="min-h-[200px]"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{report.findings}</p>
            )}
          </div>

          {/* Impression */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">IMPRESSION</h3>
            {isEditing ? (
              <Textarea
                value={report.impression}
                onChange={(e) => setReport({ ...report, impression: e.target.value })}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">{report.impression}</p>
            )}
          </div>

          {/* Radiologist Sign-off */}
          {report.status === 'finalized' && (
            <div className="border-t pt-6">
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Electronically signed by:</div>
                <div className="mt-2">{report.radiologistName}</div>
                <div className="text-gray-500">{format(new Date(report.finalizedAt!), 'dd MMM yyyy HH:mm')}</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      {report.status !== 'finalized' && (
        <div className="border-t p-4 space-y-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consentChecked}
              onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm cursor-pointer">
              I confirm that I have reviewed this report and it is accurate and complete
            </Label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done Editing' : 'Edit Report'}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" disabled={!consentChecked}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalize Report
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Finalize Report?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will finalize the report and mark it as complete. You will not be able to edit it after finalization.
                    The report will be electronically signed with your credentials.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFinalize}>
                    Finalize & Sign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}

      {report.status === 'finalized' && (
        <div className="border-t p-4 flex gap-3 flex-shrink-0">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      )}
    </div>
  );
}

// Helper functions to generate report content
function generateTechnique(modality: string): string {
  switch (modality) {
    case 'us-abdomen':
      return 'Ultrasound examination of the abdomen was performed using a curvilinear transducer. Multiple images were obtained in transverse and longitudinal planes.';
    case 'ct-abdomen':
      return 'CT examination of the abdomen and pelvis was performed following administration of intravenous contrast. Images were acquired in the portal venous phase. Multiplanar reconstructions were obtained.';
    case 'chest-xray':
      return 'PA and lateral chest radiographs were obtained with the patient in the erect position. Adequate inspiration and penetration. No rotation.';
    default:
      return 'Standard imaging protocol was followed.';
  }
}

function generateFindings(answers: any[]): string {
  // In production, this would use AI to generate findings based on answers
  return `The examination demonstrates normal anatomical structures with no significant abnormalities identified.

Liver: Normal size and echotexture. No focal lesions.
Gallbladder: Normal wall thickness. No stones or pericholecystic fluid.
Bile ducts: Common bile duct measures within normal limits. No intrahepatic duct dilatation.
Pancreas: Visualized portions appear normal.
Spleen: Normal size and echotexture.
Kidneys: Both kidneys are normal in size with preserved cortical thickness. No hydronephrosis or calculi.
Aorta: Normal caliber, no aneurysm.

No ascites or lymphadenopathy identified.`;
}

function generateImpression(answers: any[]): string {
  return 'Normal abdominal ultrasound examination. No significant abnormality detected.';
}
