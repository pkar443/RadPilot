import { useEffect, useState } from 'react';
import { Study, Patient, Report, QuestionAnswer, Modality } from '@/types/radpilot';
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
    technique: generateTechnique(study.modality, currentAnswers),
    findings: generateFindings(study.modality, currentAnswers),
    impression: generateImpression(study.modality, currentAnswers),
    status: 'draft',
  });

  useEffect(() => {
    if (report.status === 'finalized') return;
    setReport((prev) => ({
      ...prev,
      technique: generateTechnique(study.modality, currentAnswers),
      findings: generateFindings(study.modality, currentAnswers),
      impression: generateImpression(study.modality, currentAnswers),
    }));
  }, [currentAnswers, study.modality, report.status]);

  const handleRegenerate = () => {
    setReport({
      ...report,
      technique: generateTechnique(study.modality, currentAnswers),
      findings: generateFindings(study.modality, currentAnswers),
      impression: generateImpression(study.modality, currentAnswers),
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

// Helper functions to generate report content using current answers
function formatValue(value: string | number | boolean | string[] | undefined, fallback = 'not documented') {
  if (value === undefined || value === null || value === '') return fallback;
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

function getAnswerValue(answers: QuestionAnswer[], id: string) {
  return answers.find((a) => a.questionId === id)?.value;
}

function generateTechnique(modality: Modality, answers: QuestionAnswer[]): string {
  switch (modality) {
    case 'us-abdomen': {
      const fasting = formatValue(getAnswerValue(answers, 'us-2'), 'fasting status not provided').toLowerCase();
      return `Ultrasound examination of the abdomen performed with a curvilinear transducer. Multiple transverse and longitudinal images acquired; patient ${fasting}.`;
    }
    case 'ct-abdomen': {
      const contrast = formatValue(getAnswerValue(answers, 'ct-2'), 'contrast status not recorded').toLowerCase();
      const phase = formatValue(getAnswerValue(answers, 'ct-3'), 'phase not recorded');
      return `CT abdomen/pelvis performed with ${contrast}. Images acquired in the ${phase.toLowerCase()} phase with multiplanar reconstructions.`;
    }
    case 'chest-xray': {
      const projection = formatValue(getAnswerValue(answers, 'cxr-1'), 'standard projection').toUpperCase();
      const position = formatValue(getAnswerValue(answers, 'cxr-2'), 'default position').toLowerCase();
      return `${projection} chest radiograph obtained with the patient ${position}. Inspiration and penetration assessed at acquisition.`;
    }
    default:
      return 'Standard imaging protocol was followed.';
  }
}

function generateFindings(modality: Modality, answers: QuestionAnswer[]): string {
  const value = (id: string, fallback?: string) => formatValue(getAnswerValue(answers, id), fallback);
  switch (modality) {
    case 'us-abdomen': {
      const hepaticLesions = getAnswerValue(answers, 'us-5') === 'Yes';
      const gallstones = getAnswerValue(answers, 'us-10') === 'Yes';
      const ascites = value('us-32', 'Not assessed');
      const lymphNodes = value('us-33', 'Not assessed');
      return `Clinical notes: ${value('us-1', 'None provided')}

Liver: ${value('us-3', 'Size not recorded')}, ${value('us-4', 'echotexture not recorded')}. ${
        hepaticLesions
          ? `Focal lesions present (count: ${value('us-6', 'not recorded')}, largest ${value('us-7', 'N/A')} cm, ${value('us-8', 'characteristics not recorded')}).`
          : 'No focal hepatic lesions.'
      }
Gallbladder: Wall ${value('us-9', 'thickness not recorded')}; gallstones ${value('us-10')}${
        gallstones ? ` (${value('us-11', 'number not recorded')}, largest ${value('us-12', 'size not recorded')} mm).` : '.'
      } Pericholecystic fluid: ${value('us-13')}.
Bile ducts: Common bile duct ${value('us-14')} mm; intrahepatic duct dilatation ${value('us-15')}.
Pancreas: Visualization ${value('us-16')}${
        value('us-16') === 'Fully visualized'
          ? `; duct ${value('us-17', 'diameter not recorded')} mm; lesions ${value('us-18')}.`
          : '.'
      }
Spleen: ${value('us-19')} with length ${value('us-20')} cm; lesions ${value('us-21')}.
Kidneys: Right ${value('us-22')} cm, left ${value('us-23')} cm; cortex ${value('us-24')} (R) / ${value('us-25')} (L); hydronephrosis ${value('us-26')}; calculi ${value('us-27')}; masses ${value('us-28')}.
Aorta: Visualization ${value('us-29')}${
        value('us-29') === 'Fully visualized'
          ? `; maximal diameter ${value('us-30', 'not recorded')} mm; aneurysm ${value('us-31')}.`
          : '.'
      }
Other: Ascites ${ascites}; lymphadenopathy ${lymphNodes}. Additional findings: ${value('us-34', 'None reported')}.`;
    }
    case 'ct-abdomen': {
      const lesions = getAnswerValue(answers, 'ct-7') === 'Yes';
      const lymphNodes = value('ct-37', 'Not assessed');
      const ascites = value('ct-39', 'Not assessed');
      return `Clinical notes: ${value('ct-1', 'None provided')}

Liver: ${value('ct-4')} size with ${value('ct-5')} contour and ${value('ct-6')} attenuation. ${
        lesions
          ? `Focal lesions present (count ${value('ct-8')}, largest ${value('ct-9')} cm, enhancement ${value('ct-10')}).`
          : 'No focal hepatic lesions.'
      }
Gallbladder/Bile ducts: Wall ${value('ct-11')}; gallstones ${value('ct-12')}; pericholecystic fluid ${value('ct-13')}. Common bile duct ${value('ct-14')} mm; intrahepatic duct dilatation ${value('ct-15')}.
Pancreas: Size ${value('ct-16')}; duct ${value('ct-17')} mm; enhancement ${value('ct-18')}; mass ${value('ct-19')}; peripancreatic fluid ${value('ct-20')}.
Spleen: ${value('ct-21')}; splenic lesions ${value('ct-22')}.
Kidneys/Adrenals: Right ${value('ct-23')}, left ${value('ct-24')}; renal enhancement ${value('ct-25')}; hydronephrosis ${value('ct-26')}; calculi ${value('ct-27')}; masses ${value('ct-28')}; adrenals ${value('ct-29')}.
Bowel: Wall thickening ${value('ct-30')}; obstruction ${value('ct-31')}; pneumatosis ${value('ct-32')}.
Vessels: Aorta ${value('ct-33')} mm; aneurysm ${value('ct-34')}; portal vein ${value('ct-35')}; mesenteric vessels ${value('ct-36')}.
Lymph nodes: ${lymphNodes}${lymphNodes !== 'None' ? `, largest ${value('ct-38', 'size not recorded')} mm` : ''}.
Peritoneum/Other: Ascites ${ascites}; peritoneal thickening ${value('ct-40')}; free air ${value('ct-41')}; hernias ${value('ct-42')}. Additional findings: ${value('ct-43', 'None reported')}.`;
    }
    case 'chest-xray': {
      const effusion = value('cxr-13', 'Not recorded');
      const pneumothorax = value('cxr-14', 'Not recorded');
      const lines = value('cxr-25', 'Not recorded');
      return `Technical: Projection ${value('cxr-1')}, patient ${value('cxr-2').toLowerCase()}, inspiration ${value('cxr-3')}, rotation ${value('cxr-4')}, penetration ${value('cxr-5')}.

Airways: Trachea ${value('cxr-6')}; carina angle ${value('cxr-7')}.
Lungs: Volumes ${value('cxr-8')}; airspace opacification ${value('cxr-9')}; interstitial pattern ${value('cxr-10')}; nodules/masses ${value('cxr-11')}; cavitation ${value('cxr-12')}.
Pleura: Effusion ${effusion}; pneumothorax ${pneumothorax}; pleural thickening ${value('cxr-15')}.
Heart/Mediastinum: Cardiac size ${value('cxr-16')}; cardiothoracic ratio ${value('cxr-17')}; cardiac contour ${value('cxr-18')}; mediastinum ${value('cxr-19')}; hila ${value('cxr-20')}.
Bones/Soft tissues: Rib fractures ${value('cxr-21')}; bone lesions ${value('cxr-22')}; spine alignment ${value('cxr-23')}; subcutaneous emphysema ${value('cxr-24')}.
Lines/Tubes: ${lines}${
        lines === 'Present'
          ? `; ETT ${value('cxr-26')}; NGT ${value('cxr-27')}; central line ${value('cxr-28')}.`
          : '.'
      }
Other: ${value('cxr-29', 'No additional findings reported')}.`;
    }
    default:
      return 'Findings not available for this modality.';
  }
}

function generateImpression(modality: Modality, answers: QuestionAnswer[]): string {
  const pick = (id: string) => getAnswerValue(answers, id);
  const value = (id: string, fallback?: string) => formatValue(getAnswerValue(answers, id), fallback);

  switch (modality) {
    case 'us-abdomen': {
      const highlights: string[] = [];
      if (pick('us-5') === 'Yes') {
        highlights.push(`Hepatic lesions noted (largest ${value('us-7', 'size not recorded')} cm).`);
      }
      if (pick('us-10') === 'Yes') {
        highlights.push(`Cholelithiasis with ${value('us-11', 'stones not quantified')}${value('us-12', '') ? `, largest ${value('us-12')} mm` : ''}.`);
      }
      if (pick('us-31') === 'Yes') {
        highlights.push('Abdominal aortic aneurysm.');
      }
      if (pick('us-26') && pick('us-26') !== 'None') {
        highlights.push(`Hydronephrosis: ${value('us-26')}.`);
      }
      if (pick('us-32') && pick('us-32') !== 'None') {
        highlights.push(`Ascites: ${value('us-32')}.`);
      }
      if (highlights.length === 0) {
        return 'No significant abnormality detected on abdominal ultrasound.';
      }
      return highlights.join(' ');
    }
    case 'ct-abdomen': {
      const highlights: string[] = [];
      if (pick('ct-7') === 'Yes') {
        highlights.push(`Hepatic lesions (largest ${value('ct-9', 'size not recorded')} cm, enhancement ${value('ct-10', 'pattern not recorded')}).`);
      }
      if (pick('ct-26') && pick('ct-26') !== 'None') {
        highlights.push(`Hydronephrosis: ${value('ct-26')}.`);
      }
      if (pick('ct-34') === 'Present') {
        highlights.push('Aortic aneurysm.');
      }
      if (pick('ct-39') && pick('ct-39') !== 'None') {
        highlights.push(`Ascites: ${value('ct-39')}.`);
      }
      if (pick('ct-41') === 'Present') {
        highlights.push('Free intraperitoneal air.');
      }
      if (highlights.length === 0) {
        return 'No acute CT abdomen findings of significance.';
      }
      return highlights.join(' ');
    }
    case 'chest-xray': {
      const highlights: string[] = [];
      if (pick('cxr-9') && pick('cxr-9') !== 'None') {
        highlights.push(`Airspace opacification in ${value('cxr-9')}.`);
      }
      if (pick('cxr-13') && pick('cxr-13') !== 'None') {
        highlights.push(`Pleural effusion: ${value('cxr-13')}.`);
      }
      if (pick('cxr-14') && pick('cxr-14') !== 'None') {
        highlights.push(`Pneumothorax: ${value('cxr-14')}.`);
      }
      if (pick('cxr-11') && pick('cxr-11') !== 'None') {
        highlights.push(`Pulmonary nodules/mass: ${value('cxr-11')}.`);
      }
      if (pick('cxr-25') === 'Present') {
        highlights.push('Lines/tubes present—see details above.');
      }
      if (highlights.length === 0) {
        return 'No acute cardiopulmonary process identified.';
      }
      return highlights.join(' ');
    }
    default:
      return 'Impression unavailable for this modality.';
  }
}
