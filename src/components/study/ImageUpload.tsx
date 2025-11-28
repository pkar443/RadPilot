import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Modality } from '@/types/radpilot';
import { Upload, FileImage, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  modality: Modality;
  onComplete: () => void;
}

export default function ImageUpload({ modality, onComplete }: Props) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Upload</CardTitle>
        <CardDescription>Upload DICOM files or standard images (JPG/PNG)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadComplete ? (
          <>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center transition-colors',
                isUploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".dcm,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </div>
                <div className="text-sm text-gray-500">
                  DICOM files (.dcm) or Images (JPG, PNG)
                </div>
              </label>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploading files...</span>
                  <span className="font-medium text-gray-900">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-gray-900 mb-2">Upload Complete</div>
            <div className="text-sm text-gray-500 mb-6">Images successfully uploaded and ready for viewing</div>
            
            <Button size="lg" onClick={onComplete} className="w-full">
              <FileImage className="h-4 w-4 mr-2" />
              Proceed to Reporting
            </Button>
          </div>
        )}

        {!uploadComplete && !isUploading && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={simulateUpload}>
              Skip Upload (Demo)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
