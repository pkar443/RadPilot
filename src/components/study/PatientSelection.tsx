import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/types/radpilot';
import { useApp } from '@/contexts/AppContext';
import { Search, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  onPatientSelected: (patient: Patient) => void;
}

export default function PatientSelection({ onPatientSelected }: Props) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [searchNHI, setSearchNHI] = useState('');
  const [newPatient, setNewPatient] = useState({
    nhi: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other'
  });
  const { patients, addPatient } = useApp();

  const filteredPatients = patients.filter(p => 
    searchNHI === '' || p.nhi.toLowerCase().includes(searchNHI.toLowerCase()) ||
    p.firstName.toLowerCase().includes(searchNHI.toLowerCase()) ||
    p.lastName.toLowerCase().includes(searchNHI.toLowerCase())
  );

  const handleCreatePatient = () => {
    const patient: Patient = {
      id: `p${Date.now()}`,
      ...newPatient,
      createdAt: new Date().toISOString()
    };
    addPatient(patient);
    onPatientSelected(patient);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Selection</CardTitle>
        <CardDescription>Select an existing patient or register a new one</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'existing' | 'new')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing" className="cursor-pointer">Existing Patient</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="cursor-pointer">New Patient</Label>
          </div>
        </RadioGroup>

        {mode === 'existing' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by NHI, name..."
                value={searchNHI}
                onChange={(e) => setSearchNHI(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredPatients.length > 0 ? (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NHI</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.nhi}</TableCell>
                        <TableCell>{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell>{patient.dateOfBirth}</TableCell>
                        <TableCell className="capitalize">{patient.gender}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => onPatientSelected(patient)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No patients found. Try a different search or create a new patient.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nhi">NHI Number *</Label>
                <Input
                  id="nhi"
                  placeholder="ABC1234"
                  value={newPatient.nhi}
                  onChange={(e) => setNewPatient({ ...newPatient, nhi: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={newPatient.gender} onValueChange={(v) => setNewPatient({ ...newPatient, gender: v as any })}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newPatient.firstName}
                  onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newPatient.lastName}
                  onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={newPatient.dateOfBirth}
                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
              />
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCreatePatient}
              disabled={!newPatient.nhi || !newPatient.firstName || !newPatient.lastName || !newPatient.dateOfBirth}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Patient & Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
