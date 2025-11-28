import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { studies, patients, getPatientById } = useApp();
  const navigate = useNavigate();

  const recentStudies = studies.slice(0, 5);

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case 'us-abdomen': return 'US Abdomen';
      case 'ct-abdomen': return 'CT Abdomen';
      case 'chest-xray': return 'Chest X-ray';
      default: return modality;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Radiomed</h1>
        <p className="text-gray-600 mt-2">Guided radiology reporting with integrated DICOM viewing</p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200" onClick={() => navigate('/new-study')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Start New Study</CardTitle>
                <CardDescription>Create a new radiology study and report</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              Begin New Study
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200" onClick={() => navigate('/patients')}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Existing Patients</CardTitle>
                <CardDescription>View and manage patient records</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" size="lg">
              View Patients ({patients.length})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Studies */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <CardTitle>Recent Studies</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/studies')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentStudies.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No studies yet. Start your first study above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>NHI</TableHead>
                  <TableHead>Modality</TableHead>
                  <TableHead>Study Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudies.map((study) => {
                  const patient = getPatientById(study.patientId);
                  return (
                    <TableRow key={study.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/study/${study.id}`)}>
                      <TableCell className="font-medium">
                        {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{patient?.nhi || '-'}</TableCell>
                      <TableCell>{getModalityLabel(study.modality)}</TableCell>
                      <TableCell>{format(new Date(study.studyDate), 'dd MMM yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(study.status)} variant="secondary">
                          {study.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/study/${study.id}`);
                        }}>
                          {study.status === 'completed' ? 'View' : 'Continue'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Patients</CardDescription>
            <CardTitle className="text-3xl">{patients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Studies</CardDescription>
            <CardTitle className="text-3xl">{studies.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Reports</CardDescription>
            <CardTitle className="text-3xl">
              {studies.filter(s => s.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
