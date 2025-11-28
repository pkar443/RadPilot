import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function StudiesList() {
  const { studies, patients, getPatientById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  const filteredStudies = studies.filter(study => {
    const patient = getPatientById(study.patientId);
    const matchesSearch = searchTerm === '' ||
      patient?.nhi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Studies</h1>
          <p className="text-gray-600 mt-2">View and manage all radiology studies</p>
        </div>
        <Button onClick={() => navigate('/new-study')}>
          <Plus className="h-4 w-4 mr-2" />
          New Study
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>All Studies</CardTitle>
              <CardDescription>{studies.length} total studies</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search studies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Study ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>NHI</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Study Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => {
                const patient = getPatientById(study.patientId);
                return (
                  <TableRow
                    key={study.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/study/${study.id}`)}
                  >
                    <TableCell className="font-mono text-sm">{study.id}</TableCell>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/reporting/${study.id}`);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {study.status === 'completed' ? 'View' : 'Continue'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredStudies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No studies found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
