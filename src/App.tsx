import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import DisclaimerBanner from "./components/layout/DisclaimerBanner";
import Dashboard from "./components/dashboard/Dashboard";
import NewStudyWizard from "./components/study/NewStudyWizard";
import ReportingInterface from "./components/reporting/ReportingInterface";
import PatientsList from "./components/patients/PatientsList";
import StudiesList from "./components/studies/StudiesList";

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/reporting/:studyId" element={<ReportingInterface />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DisclaimerBanner />
      <Sidebar />
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-study" element={<NewStudyWizard />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/studies" element={<StudiesList />} />
            <Route path="/settings" element={<div className="text-center py-12 text-gray-500">Settings page coming soon</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
