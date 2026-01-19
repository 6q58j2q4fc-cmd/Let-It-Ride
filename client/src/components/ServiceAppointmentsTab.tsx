import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { 
  Wrench, Clock, CheckCircle, XCircle, AlertCircle, 
  Phone, Mail, Calendar, DollarSign, RefreshCw,
  Eye, Edit, Bike
} from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Wrench },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
};

const serviceTypeLabels: Record<string, string> = {
  'basic-tuneup': 'Basic Tune-Up ($60)',
  'standard-tuneup': 'Standard Tune-Up ($90)',
  'premium-tuneup': 'Premium Tune-Up ($120)',
  'ebike-build': 'E-Bike Build & Safety Check ($125-$250)',
  'flat-repair': 'Flat Repair ($15-$20)',
  'brake-adjustment': 'Brake Adjustment ($25)',
  'derailleur-adjustment': 'Derailleur Adjustment ($30)',
  'wheel-truing': 'Wheel Truing ($35)',
  'battery-diagnostic': 'Battery Diagnostic ($50)',
  'motor-diagnostic': 'Motor Diagnostic ($75)',
  'electrical-repair': 'Electrical Repair ($100/hr)',
  'general-repair': 'General Repair ($100/hr)',
  'other': 'Other Service',
};

const bikeTypeLabels: Record<string, string> = {
  'pedego-cruiser': 'Pedego Cruiser',
  'pedego-interceptor': 'Pedego Interceptor',
  'pedego-city-commuter': 'Pedego City Commuter',
  'pedego-boomerang': 'Pedego Boomerang',
  'pedego-element': 'Pedego Element',
  'pedego-tandem': 'Pedego Tandem',
  'pedego-cargo': 'Pedego Cargo',
  'pedego-ridge-rider': 'Pedego Ridge Rider',
  'pedego-trail-tracker': 'Pedego Trail Tracker',
  'other-ebike': 'Other E-Bike',
  'standard-bike': 'Standard Bicycle',
  'mountain-bike': 'Mountain Bike',
  'road-bike': 'Road Bike',
};

type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

interface Appointment {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bikeType: string;
  bikeBrand: string | null;
  bikeModel: string | null;
  serviceType: string;
  preferredDate: Date;
  preferredTime: string | null;
  issueDescription: string | null;
  status: AppointmentStatus;
  notes: string | null;
  estimatedCost: string | null;
  actualCost: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ServiceAppointmentsTab() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '' as AppointmentStatus | '',
    notes: '',
    estimatedCost: '',
    actualCost: '',
  });

  const utils = trpc.useUtils();

  const { data: appointments, isLoading, refetch } = trpc.service.getAll.useQuery();

  const updateMutation = trpc.service.updateStatus.useMutation({
    onSuccess: () => {
      toast.success('Appointment updated successfully');
      utils.service.getAll.invalidate();
      setIsEditDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });

  const filteredAppointments = appointments?.filter((apt) => {
    if (statusFilter === 'all') return true;
    return apt.status === statusFilter;
  }) as Appointment[] || [];

  const stats = {
    total: appointments?.length || 0,
    pending: appointments?.filter((a: Appointment) => a.status === 'pending').length || 0,
    confirmed: appointments?.filter((a: Appointment) => a.status === 'confirmed').length || 0,
    inProgress: appointments?.filter((a: Appointment) => a.status === 'in_progress').length || 0,
    completed: appointments?.filter((a: Appointment) => a.status === 'completed').length || 0,
  };

  const handleEditClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      status: appointment.status,
      notes: appointment.notes || '',
      estimatedCost: appointment.estimatedCost || '',
      actualCost: appointment.actualCost || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedAppointment) return;
    
    updateMutation.mutate({
      id: selectedAppointment.id,
      status: editForm.status as AppointmentStatus,
      notes: editForm.notes || undefined,
      estimatedCost: editForm.estimatedCost || undefined,
      actualCost: editForm.actualCost || undefined,
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pending
            </CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Confirmed
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.confirmed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-600" />
              In Progress
            </CardDescription>
            <CardTitle className="text-2xl text-purple-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Completed
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Service Appointments</CardTitle>
              <CardDescription>Manage customer service requests</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No service appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment: Appointment) => {
                const StatusIcon = statusConfig[appointment.status as AppointmentStatus]?.icon || AlertCircle;
                return (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{appointment.customerName}</h3>
                          <Badge className={statusConfig[appointment.status as AppointmentStatus]?.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[appointment.status as AppointmentStatus]?.label}
                          </Badge>
                        </div>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${appointment.customerEmail}`} className="hover:underline">
                              {appointment.customerEmail}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${appointment.customerPhone}`} className="hover:underline">
                              {appointment.customerPhone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(appointment.preferredDate)}
                            {appointment.preferredTime && ` at ${appointment.preferredTime}`}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Bike className="h-4 w-4" />
                            {bikeTypeLabels[appointment.bikeType] || appointment.bikeType}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <Badge variant="outline">
                            <Wrench className="h-3 w-3 mr-1" />
                            {serviceTypeLabels[appointment.serviceType] || appointment.serviceType}
                          </Badge>
                          {appointment.estimatedCost && (
                            <Badge variant="outline" className="text-green-600">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Est: ${appointment.estimatedCost}
                            </Badge>
                          )}
                          {appointment.actualCost && (
                            <Badge className="bg-green-100 text-green-800">
                              <DollarSign className="h-3 w-3 mr-1" />
                              Final: ${appointment.actualCost}
                            </Badge>
                          )}
                        </div>

                        {appointment.issueDescription && (
                          <p className="text-sm text-muted-foreground italic">
                            "{appointment.issueDescription}"
                          </p>
                        )}

                        {appointment.notes && (
                          <p className="text-sm bg-muted p-2 rounded">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(appointment)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Appointment</DialogTitle>
            <DialogDescription>
              Update the status and details for {selectedAppointment?.customerName}'s appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) => setEditForm({ ...editForm, status: value as AppointmentStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Cost ($)</Label>
              <Input
                type="text"
                placeholder="e.g., 90.00"
                value={editForm.estimatedCost}
                onChange={(e) => setEditForm({ ...editForm, estimatedCost: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Actual Cost ($)</Label>
              <Input
                type="text"
                placeholder="e.g., 85.00"
                value={editForm.actualCost}
                onChange={(e) => setEditForm({ ...editForm, actualCost: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add internal notes about this appointment..."
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
