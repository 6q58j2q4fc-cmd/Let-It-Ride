import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl opacity-90">
              Have questions about tours, rentals, or e-bikes? We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    25 NW Minnesota Avenue #6<br />
                    Bend, OR 97701
                  </p>
                  <a 
                    href="https://maps.google.com/?q=25+NW+Minnesota+Ave+Bend+OR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm mt-2 inline-block"
                  >
                    Get Directions →
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Call Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="tel:5416472331" className="text-lg font-medium hover:text-primary">
                    (541) 647-2331
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    We're happy to answer your questions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a href="mailto:info@letitridebend.com" className="font-medium hover:text-primary">
                    info@letitridebend.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    We typically respond within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Sunday</span>
                      <span className="font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.facebook.com/letitridebend"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href="https://www.instagram.com/letitridebend"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Select 
                          value={formData.subject} 
                          onValueChange={(v) => setFormData({...formData, subject: v})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tour">Tour Inquiry</SelectItem>
                            <SelectItem value="rental">Rental Question</SelectItem>
                            <SelectItem value="purchase">E-Bike Purchase</SelectItem>
                            <SelectItem value="custom">Custom Tour Request</SelectItem>
                            <SelectItem value="group">Group Booking</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={loading}>
                      {loading ? 'Sending...' : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2867.8!2d-121.3134!3d44.0582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDAzJzI5LjUiTiAxMjHCsDE4JzQ4LjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <Footer />
    </div>
  );
}
