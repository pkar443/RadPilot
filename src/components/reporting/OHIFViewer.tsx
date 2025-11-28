interface Props {
  studyId: string;
}

export default function OHIFViewer({ studyId }: Props) {
  // In production, this would load the actual OHIF viewer with the study
  // For demo purposes, we'll show a placeholder with typical DICOM viewer UI
  
  return (
    <div className="h-full bg-black flex flex-col">
      {/* Viewer Toolbar */}
      <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4 gap-2 flex-shrink-0">
        <button className="px-3 py-1.5 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded">
          W/L
        </button>
        <button className="px-3 py-1.5 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded">
          Zoom
        </button>
        <button className="px-3 py-1.5 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded">
          Pan
        </button>
        <button className="px-3 py-1.5 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded">
          Measure
        </button>
        <button className="px-3 py-1.5 text-xs text-white bg-gray-700 hover:bg-gray-600 rounded">
          Annotate
        </button>
        <div className="ml-auto text-xs text-gray-400">
          Study ID: {studyId}
        </div>
      </div>

      {/* Viewer Content */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Demo medical image placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80"
            alt="Medical imaging placeholder"
            className="max-w-full max-h-full object-contain opacity-80"
          />
        </div>
        
        {/* Overlay info (typical DICOM viewer annotations) */}
        <div className="absolute top-4 left-4 text-white text-xs space-y-1 font-mono">
          <div>Patient: Demo Patient</div>
          <div>Study Date: {new Date().toLocaleDateString()}</div>
          <div>Series: 1/1</div>
          <div>Image: 1/24</div>
        </div>

        <div className="absolute top-4 right-4 text-white text-xs space-y-1 font-mono text-right">
          <div>W: 400 L: 40</div>
          <div>Zoom: 100%</div>
        </div>

        <div className="absolute bottom-4 left-4 text-white text-xs font-mono">
          <div>OHIF Viewer v3.0</div>
        </div>
      </div>
    </div>
  );
}
