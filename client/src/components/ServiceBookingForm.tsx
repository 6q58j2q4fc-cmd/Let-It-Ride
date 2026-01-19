import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { CalendarIcon, Wrench, Bike, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const bikeTypes = [
  { value: 'pedego-cruiser', label: 'Pedego Cruiser' },
  { value: 'pedego-interceptor', label: 'Pedego Interceptor' },
  { value: 'pedego-city-commuter', label: 'Pedego City Commuter' },
  { value: 'pedego-boomerang', label: 'Pedego Boomerang' },
  { value: 'pedego-element', label: 'Pedego Element' },
  { value: 'pedego-tandem', label: 'Pedego Tandem' },
  { value: 'pedego-cargo', label: 'Pedego Stretch (Cargo)' },
  { value: 'pedego-ridge-rider', label: 'Pedego Ridge Rider' },
  { value: 'pedego-trail-tracker', label: 'Pedego Trail Tracker' },
  { value: 'other-ebike', label: 'Other E-Bike Brand' },
  { value: 'standard-bike', label: 'Standard Bicycle' },
  { value: 'mountain-bike', label: 'Mountain Bike' },
  { value: 'road-bike', label: 'Road Bike' },
];

const serviceTypes = [
  { value: 'basic-tuneup', label: 'Basic Tune-Up ($60)' },
  { value: 'standard-tuneup', label: 'Standard Tune-Up ($90)' },
  { value: 'premium-tuneup', label: 'Premium Tune-Up ($120)' },
  { value: 'ebike-build', label: 'E-Bike Build & Safety Check ($125-$250)' },
  { value: 'flat-repair', label: 'Flat Repair ($15-$20)' },
  { value: 'brake-service', label: 'Brake Service' },
  { value: 'drivetrain', label: 'Drivetrain Service' },
  { value: 'battery-diagnostic', label: 'Battery Diagnostic ($50)' },
  { value: 'motor-diagnostic', label: 'Motor Diagnostic ($75)' },
  { value: 'general-repair', label: 'General Repair (Free Estimate)' },
  { value: 'other', label: 'Other - Describe Below' },
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

export function ServiceBookingForm() {
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bikeType: '',
    bikeBrand: '',
    bikeModel: '',
    serviceType: '',
    preferredTime: '',
    issueDescription: '',
  });

  const submitBooking = trpc.service.requestAppointment.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success('Service request submitted! We\'ll contact you shortly to confirm.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error('Please select a preferred date');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone || !formData.bikeType || !formData.serviceType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    submitBooking.mutate({
      ...formData,
      preferredDate: date.toISOString(),
    });
  };

  if (isSubmitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Request Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your service request. Our team will contact you within 24 hours 
            to confirm your appointment.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? Call us at <a href="tel:5413063177" className="text-primary font-medium">(541) 306-3177</a>
          </p>
          <Button 
            className="mt-6" 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: '',
                email: '',
                phone: '',
                bikeType: '',
                bikeBrand: '',
                bikeModel: '',
                serviceType: '',
                preferredTime: '',
                issueDescription: '',
              });
              setDate(undefined);
            }}
          >
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Request Service Appointment</CardTitle>
            <CardDescription>Fill out the form below and we'll contact you to confirm</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
              Contact Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(541) 555-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Bike Information */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
              Bike Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bikeType">Bike Type *</Label>
                <Select
                  value={formData.bikeType}
                  onValueChange={(value) => setFormData({ ...formData, bikeType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bike type" />
                  </SelectTrigger>
                  <SelectContent>
                    {bikeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Needed *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(formData.bikeType === 'other-ebike' || formData.bikeType === 'standard-bike' || formData.bikeType === 'mountain-bike' || formData.bikeType === 'road-bike') && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bikeBrand">Bike Brand</Label>
                  <Input
                    id="bikeBrand"
                    placeholder="e.g., Trek, Specialized, Rad Power"
                    value={formData.bikeBrand}
                    onChange={(e) => setFormData({ ...formData, bikeBrand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bikeModel">Bike Model</Label>
                  <Input
                    id="bikeModel"
                    placeholder="e.g., Model name or year"
                    value={formData.bikeModel}
                    onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preferred Date & Time */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
              Preferred Date & Time
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preferred Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => 
                        date < new Date() || 
                        date.getDay() === 0 // Closed Sundays
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select
                  value={formData.preferredTime}
                  onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
              Describe the Issue
            </h4>
            <div className="space-y-2">
              <Label htmlFor="issueDescription">What's wrong with your bike? (Optional)</Label>
              <Textarea
                id="issueDescription"
                placeholder="Describe any issues, symptoms, or specific service requests..."
                rows={4}
                value={formData.issueDescription}
                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4" />
                  Submit Service Request
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              We'll contact you within 24 hours to confirm your appointment. 
              Free estimates on all repairs.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
