import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('disclaimer-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('disclaimer-dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 fixed top-16 left-0 right-0 z-30">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-900 flex-1">
          <strong>Pilot Program Notice:</strong> This application is part of a clinical pilot program. 
          All reports generated should be reviewed and verified by qualified radiologists before clinical use.
        </p>
        <button
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800 transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
