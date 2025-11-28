import { Question, Modality } from '@/types/radpilot';

export const getQuestionsForModality = (modality: Modality): Question[] => {
  switch (modality) {
    case 'us-abdomen':
      return usAbdomenQuestions;
    case 'ct-abdomen':
      return ctAbdomenQuestions;
    case 'chest-xray':
      return chestXrayQuestions;
    default:
      return [];
  }
};

const usAbdomenQuestions: Question[] = [
  // Clinical Information
  { id: 'us-1', section: 'Clinical Information', text: 'Clinical indication for examination', type: 'textarea', required: true },
  { id: 'us-2', section: 'Clinical Information', text: 'Patient fasting status', type: 'radio', options: ['Fasting', 'Non-fasting', 'Unknown'], required: true },
  
  // Liver
  { id: 'us-3', section: 'Liver', text: 'Liver size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'us-4', section: 'Liver', text: 'Liver echotexture', type: 'radio', options: ['Normal', 'Coarse', 'Heterogeneous'], required: true },
  { id: 'us-5', section: 'Liver', text: 'Focal liver lesions present?', type: 'radio', options: ['Yes', 'No'], required: true },
  { id: 'us-6', section: 'Liver', text: 'Number of lesions', type: 'numeric', required: true, conditionalOn: { questionId: 'us-5', value: 'Yes' } },
  { id: 'us-7', section: 'Liver', text: 'Largest lesion size (cm)', type: 'numeric', unit: 'cm', required: true, conditionalOn: { questionId: 'us-5', value: 'Yes' } },
  { id: 'us-8', section: 'Liver', text: 'Lesion characteristics', type: 'dropdown', options: ['Cystic', 'Solid', 'Mixed', 'Calcified'], required: true, conditionalOn: { questionId: 'us-5', value: 'Yes' } },
  
  // Gallbladder
  { id: 'us-9', section: 'Gallbladder', text: 'Gallbladder wall thickness', type: 'radio', options: ['Normal (<3mm)', 'Thickened (>3mm)'], required: true },
  { id: 'us-10', section: 'Gallbladder', text: 'Gallstones present?', type: 'radio', options: ['Yes', 'No'], required: true },
  { id: 'us-11', section: 'Gallbladder', text: 'Number of stones', type: 'radio', options: ['Single', 'Multiple'], required: true, conditionalOn: { questionId: 'us-10', value: 'Yes' } },
  { id: 'us-12', section: 'Gallbladder', text: 'Largest stone size (mm)', type: 'numeric', unit: 'mm', required: true, conditionalOn: { questionId: 'us-10', value: 'Yes' } },
  { id: 'us-13', section: 'Gallbladder', text: 'Pericholecystic fluid', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Bile Ducts
  { id: 'us-14', section: 'Bile Ducts', text: 'Common bile duct diameter (mm)', type: 'numeric', unit: 'mm', required: true },
  { id: 'us-15', section: 'Bile Ducts', text: 'Intrahepatic duct dilatation', type: 'radio', options: ['Yes', 'No'], required: true },
  
  // Pancreas
  { id: 'us-16', section: 'Pancreas', text: 'Pancreas visualization', type: 'radio', options: ['Fully visualized', 'Partially visualized', 'Not visualized'], required: true },
  { id: 'us-17', section: 'Pancreas', text: 'Pancreatic duct diameter (mm)', type: 'numeric', unit: 'mm', required: true, conditionalOn: { questionId: 'us-16', value: 'Fully visualized' } },
  { id: 'us-18', section: 'Pancreas', text: 'Pancreatic lesions', type: 'radio', options: ['Present', 'Absent', 'Indeterminate'], required: true, conditionalOn: { questionId: 'us-16', value: 'Fully visualized' } },
  
  // Spleen
  { id: 'us-19', section: 'Spleen', text: 'Spleen size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'us-20', section: 'Spleen', text: 'Splenic length (cm)', type: 'numeric', unit: 'cm', required: true },
  { id: 'us-21', section: 'Spleen', text: 'Splenic lesions', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Kidneys
  { id: 'us-22', section: 'Kidneys', text: 'Right kidney length (cm)', type: 'numeric', unit: 'cm', required: true },
  { id: 'us-23', section: 'Kidneys', text: 'Left kidney length (cm)', type: 'numeric', unit: 'cm', required: true },
  { id: 'us-24', section: 'Kidneys', text: 'Right kidney cortical thickness', type: 'radio', options: ['Normal', 'Thinned'], required: true },
  { id: 'us-25', section: 'Kidneys', text: 'Left kidney cortical thickness', type: 'radio', options: ['Normal', 'Thinned'], required: true },
  { id: 'us-26', section: 'Kidneys', text: 'Hydronephrosis', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'us-27', section: 'Kidneys', text: 'Renal calculi', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'us-28', section: 'Kidneys', text: 'Renal masses', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  
  // Aorta
  { id: 'us-29', section: 'Aorta', text: 'Abdominal aorta visualization', type: 'radio', options: ['Fully visualized', 'Partially visualized', 'Not visualized'], required: true },
  { id: 'us-30', section: 'Aorta', text: 'Maximum aortic diameter (mm)', type: 'numeric', unit: 'mm', required: true, conditionalOn: { questionId: 'us-29', value: 'Fully visualized' } },
  { id: 'us-31', section: 'Aorta', text: 'Aneurysm present', type: 'radio', options: ['Yes', 'No'], required: true, conditionalOn: { questionId: 'us-29', value: 'Fully visualized' } },
  
  // Ascites
  { id: 'us-32', section: 'Other Findings', text: 'Ascites', type: 'radio', options: ['None', 'Minimal', 'Moderate', 'Large'], required: true },
  { id: 'us-33', section: 'Other Findings', text: 'Lymphadenopathy', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'us-34', section: 'Other Findings', text: 'Additional findings', type: 'textarea', required: false }
];

const ctAbdomenQuestions: Question[] = [
  // Clinical & Technical
  { id: 'ct-1', section: 'Clinical Information', text: 'Clinical indication', type: 'textarea', required: true },
  { id: 'ct-2', section: 'Technical', text: 'Contrast administration', type: 'radio', options: ['IV contrast', 'Oral contrast', 'Both', 'Non-contrast'], required: true },
  { id: 'ct-3', section: 'Technical', text: 'Scan phase', type: 'dropdown', options: ['Arterial', 'Portal venous', 'Delayed', 'Multi-phase'], required: true },
  
  // Liver
  { id: 'ct-4', section: 'Liver', text: 'Liver size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'ct-5', section: 'Liver', text: 'Liver contour', type: 'radio', options: ['Smooth', 'Nodular', 'Irregular'], required: true },
  { id: 'ct-6', section: 'Liver', text: 'Liver attenuation', type: 'radio', options: ['Normal', 'Decreased (fatty)', 'Increased'], required: true },
  { id: 'ct-7', section: 'Liver', text: 'Focal liver lesions', type: 'radio', options: ['Yes', 'No'], required: true },
  { id: 'ct-8', section: 'Liver', text: 'Number of lesions', type: 'numeric', required: true, conditionalOn: { questionId: 'ct-7', value: 'Yes' } },
  { id: 'ct-9', section: 'Liver', text: 'Largest lesion size (cm)', type: 'numeric', unit: 'cm', required: true, conditionalOn: { questionId: 'ct-7', value: 'Yes' } },
  { id: 'ct-10', section: 'Liver', text: 'Lesion enhancement pattern', type: 'dropdown', options: ['Hypervascular', 'Hypovascular', 'Cystic', 'Calcified', 'Mixed'], required: true, conditionalOn: { questionId: 'ct-7', value: 'Yes' } },
  
  // Gallbladder & Bile Ducts
  { id: 'ct-11', section: 'Gallbladder', text: 'Gallbladder wall thickness', type: 'radio', options: ['Normal', 'Thickened'], required: true },
  { id: 'ct-12', section: 'Gallbladder', text: 'Gallstones', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-13', section: 'Gallbladder', text: 'Pericholecystic fluid/stranding', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-14', section: 'Bile Ducts', text: 'Common bile duct diameter (mm)', type: 'numeric', unit: 'mm', required: true },
  { id: 'ct-15', section: 'Bile Ducts', text: 'Intrahepatic duct dilatation', type: 'radio', options: ['Yes', 'No'], required: true },
  
  // Pancreas
  { id: 'ct-16', section: 'Pancreas', text: 'Pancreatic size', type: 'radio', options: ['Normal', 'Enlarged', 'Atrophic'], required: true },
  { id: 'ct-17', section: 'Pancreas', text: 'Pancreatic duct diameter (mm)', type: 'numeric', unit: 'mm', required: true },
  { id: 'ct-18', section: 'Pancreas', text: 'Pancreatic enhancement', type: 'radio', options: ['Normal', 'Decreased', 'Heterogeneous'], required: true },
  { id: 'ct-19', section: 'Pancreas', text: 'Pancreatic mass', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-20', section: 'Pancreas', text: 'Peripancreatic fluid/stranding', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Spleen
  { id: 'ct-21', section: 'Spleen', text: 'Spleen size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'ct-22', section: 'Spleen', text: 'Splenic lesions', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Kidneys & Adrenals
  { id: 'ct-23', section: 'Kidneys', text: 'Right kidney size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'ct-24', section: 'Kidneys', text: 'Left kidney size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'ct-25', section: 'Kidneys', text: 'Renal enhancement', type: 'radio', options: ['Symmetric', 'Asymmetric'], required: true },
  { id: 'ct-26', section: 'Kidneys', text: 'Hydronephrosis', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'ct-27', section: 'Kidneys', text: 'Renal calculi', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'ct-28', section: 'Kidneys', text: 'Renal masses', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'ct-29', section: 'Adrenals', text: 'Adrenal glands', type: 'radio', options: ['Normal', 'Nodule/mass present', 'Thickened'], required: true },
  
  // Bowel
  { id: 'ct-30', section: 'Bowel', text: 'Bowel wall thickening', type: 'radio', options: ['None', 'Small bowel', 'Colon', 'Both'], required: true },
  { id: 'ct-31', section: 'Bowel', text: 'Bowel obstruction', type: 'radio', options: ['None', 'Small bowel', 'Large bowel'], required: true },
  { id: 'ct-32', section: 'Bowel', text: 'Pneumatosis', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Vessels
  { id: 'ct-33', section: 'Vessels', text: 'Abdominal aorta diameter (mm)', type: 'numeric', unit: 'mm', required: true },
  { id: 'ct-34', section: 'Vessels', text: 'Aortic aneurysm', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-35', section: 'Vessels', text: 'Portal vein patency', type: 'radio', options: ['Patent', 'Thrombosed', 'Partially thrombosed'], required: true },
  { id: 'ct-36', section: 'Vessels', text: 'Mesenteric vessels', type: 'radio', options: ['Normal', 'Abnormal'], required: true },
  
  // Lymph Nodes
  { id: 'ct-37', section: 'Lymph Nodes', text: 'Lymphadenopathy', type: 'radio', options: ['None', 'Mesenteric', 'Retroperitoneal', 'Both'], required: true },
  { id: 'ct-38', section: 'Lymph Nodes', text: 'Largest node size (mm)', type: 'numeric', unit: 'mm', required: true, conditionalOn: { questionId: 'ct-37', value: 'Mesenteric' } },
  
  // Peritoneum & Other
  { id: 'ct-39', section: 'Peritoneum', text: 'Ascites', type: 'radio', options: ['None', 'Minimal', 'Moderate', 'Large'], required: true },
  { id: 'ct-40', section: 'Peritoneum', text: 'Peritoneal thickening/nodularity', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-41', section: 'Other', text: 'Free air', type: 'radio', options: ['Present', 'Absent'], required: true },
  { id: 'ct-42', section: 'Other', text: 'Hernias', type: 'radio', options: ['None', 'Inguinal', 'Umbilical', 'Incisional', 'Other'], required: true },
  { id: 'ct-43', section: 'Other', text: 'Additional findings', type: 'textarea', required: false }
];

const chestXrayQuestions: Question[] = [
  // Technical
  { id: 'cxr-1', section: 'Technical', text: 'Projection', type: 'radio', options: ['PA', 'AP', 'Lateral', 'PA and Lateral'], required: true },
  { id: 'cxr-2', section: 'Technical', text: 'Patient position', type: 'radio', options: ['Erect', 'Supine', 'Semi-erect'], required: true },
  { id: 'cxr-3', section: 'Technical', text: 'Inspiration', type: 'radio', options: ['Adequate', 'Inadequate'], required: true },
  { id: 'cxr-4', section: 'Technical', text: 'Rotation', type: 'radio', options: ['None', 'Mild', 'Moderate'], required: true },
  { id: 'cxr-5', section: 'Technical', text: 'Penetration', type: 'radio', options: ['Adequate', 'Underpenetrated', 'Overpenetrated'], required: true },
  
  // Airways
  { id: 'cxr-6', section: 'Airways', text: 'Trachea position', type: 'radio', options: ['Midline', 'Deviated right', 'Deviated left'], required: true },
  { id: 'cxr-7', section: 'Airways', text: 'Carina angle', type: 'radio', options: ['Normal', 'Widened', 'Narrowed'], required: true },
  
  // Lungs
  { id: 'cxr-8', section: 'Lungs', text: 'Lung volumes', type: 'radio', options: ['Normal', 'Hyperinflated', 'Reduced'], required: true },
  { id: 'cxr-9', section: 'Lungs', text: 'Airspace opacification', type: 'radio', options: ['None', 'Right upper', 'Right middle', 'Right lower', 'Left upper', 'Left lower', 'Bilateral'], required: true },
  { id: 'cxr-10', section: 'Lungs', text: 'Interstitial pattern', type: 'radio', options: ['None', 'Reticular', 'Nodular', 'Reticulonodular'], required: true },
  { id: 'cxr-11', section: 'Lungs', text: 'Nodules/masses', type: 'radio', options: ['None', 'Solitary nodule', 'Multiple nodules', 'Mass'], required: true },
  { id: 'cxr-12', section: 'Lungs', text: 'Cavitation', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Pleura
  { id: 'cxr-13', section: 'Pleura', text: 'Pleural effusion', type: 'radio', options: ['None', 'Right small', 'Right moderate', 'Right large', 'Left small', 'Left moderate', 'Left large', 'Bilateral'], required: true },
  { id: 'cxr-14', section: 'Pleura', text: 'Pneumothorax', type: 'radio', options: ['None', 'Right small', 'Right large', 'Left small', 'Left large', 'Bilateral'], required: true },
  { id: 'cxr-15', section: 'Pleura', text: 'Pleural thickening', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  
  // Heart & Mediastinum
  { id: 'cxr-16', section: 'Heart', text: 'Cardiac size', type: 'radio', options: ['Normal', 'Enlarged', 'Small'], required: true },
  { id: 'cxr-17', section: 'Heart', text: 'Cardiothoracic ratio', type: 'radio', options: ['<0.5', '0.5-0.6', '>0.6'], required: true },
  { id: 'cxr-18', section: 'Heart', text: 'Cardiac contour', type: 'radio', options: ['Normal', 'Abnormal'], required: true },
  { id: 'cxr-19', section: 'Mediastinum', text: 'Mediastinal contour', type: 'radio', options: ['Normal', 'Widened', 'Mass/adenopathy'], required: true },
  { id: 'cxr-20', section: 'Mediastinum', text: 'Hilar prominence', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  
  // Bones & Soft Tissues
  { id: 'cxr-21', section: 'Bones', text: 'Rib fractures', type: 'radio', options: ['None', 'Right', 'Left', 'Bilateral'], required: true },
  { id: 'cxr-22', section: 'Bones', text: 'Bone lesions', type: 'radio', options: ['None', 'Lytic', 'Sclerotic', 'Mixed'], required: true },
  { id: 'cxr-23', section: 'Bones', text: 'Spine alignment', type: 'radio', options: ['Normal', 'Scoliosis', 'Kyphosis'], required: true },
  { id: 'cxr-24', section: 'Soft Tissues', text: 'Subcutaneous emphysema', type: 'radio', options: ['Present', 'Absent'], required: true },
  
  // Lines & Tubes
  { id: 'cxr-25', section: 'Lines & Tubes', text: 'Lines/tubes present', type: 'radio', options: ['None', 'Present'], required: true },
  { id: 'cxr-26', section: 'Lines & Tubes', text: 'ETT position', type: 'radio', options: ['Not present', 'Satisfactory', 'Too high', 'Too low'], required: true, conditionalOn: { questionId: 'cxr-25', value: 'Present' } },
  { id: 'cxr-27', section: 'Lines & Tubes', text: 'NGT position', type: 'radio', options: ['Not present', 'Satisfactory', 'Malpositioned'], required: true, conditionalOn: { questionId: 'cxr-25', value: 'Present' } },
  { id: 'cxr-28', section: 'Lines & Tubes', text: 'Central line position', type: 'radio', options: ['Not present', 'Satisfactory', 'Malpositioned'], required: true, conditionalOn: { questionId: 'cxr-25', value: 'Present' } },
  
  // Other
  { id: 'cxr-29', section: 'Other', text: 'Additional findings', type: 'textarea', required: false }
];
