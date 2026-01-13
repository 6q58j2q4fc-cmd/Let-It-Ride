import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Clock, Users, MapPin, Bike, Mountain, Wine, ChevronRight, 
  Star, Check, CalendarIcon, Phone, Mail, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const toursData: Record<string, any> = {
  'short-and-sweet': {
    id: 1,
    slug: 'short-and-sweet',
    name: 'Short & Sweet Tour',
    duration: '1.5 hours',
    price: 75,
    shortDescription: 'Perfect introduction to Bend! Best bang for the buck.',
    description: 'Do you want to have lots of fun without taking up your whole day? This is the best bang for the buck in Bend! With our top of the line electric bikes, you can breeze along on our guided tour without breaking a sweat. Your guide will share the history of Bend while showing you great local spots with plenty of picture opportunities.',
    image: '/images/ebike-tour-group.jpg',
    highlights: ['Local history & stories', 'Photo opportunities', 'Downtown Bend exploration', 'Comfortable pace'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle'],
    maxGuests: 10,
    times: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM']
  },
  'deschutes-river': {
    id: 2,
    slug: 'deschutes-river',
    name: 'Deschutes River Tour',
    duration: '2 hours',
    price: 100,
    shortDescription: 'Cruise along the beautiful Deschutes River with stunning scenery.',
    description: 'Take a tour of the Deschutes River as it winds through and around the city of Bend, while riding our premium electric bikes. You will find yourself cruising along the river with our guide, enjoying the sights and sounds without breaking a sweat. Enjoy awesome scenery and wildlife, while your guide shares historic stories of Bend and the local area with plenty of opportunities to take pictures and ask questions.',
    image: '/images/deschutes-river-trail.jpg',
    highlights: ['Scenic river views', 'Wildlife spotting', 'Historic stories', 'Nature trails'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', 'Water bottle', 'Trail snacks'],
    maxGuests: 8,
    times: ['9:00 AM', '11:00 AM', '2:00 PM']
  },
  'taste-of-bend': {
    id: 3,
    slug: 'taste-of-bend',
    name: 'Taste of Bend Tour',
    duration: '2 hours',
    price: 150,
    shortDescription: 'Experience Bend\'s famous craft beverage scene!',
    description: 'Are you here to enjoy the best food and drink in the west? We can help. The Taste of Bend Tour offers a guided tasting experience, visiting some of Bend\'s breweries and pubs rooms. For our friends who might not love beer as much as the rest of your tour group, we are happy to mix it up and visit some of Bend\'s cider houses, wine tasting rooms or even a kombucha brewery – there\'s something for everyone!',
    image: '/images/bend-brewery-patio.jpg',
    highlights: ['Craft brewery visits', 'Local tastings included', 'Flexible beverage options', 'Food pairings'],
    included: ['Premium Pedego e-bike', 'Helmet', 'Expert guide', '3 tasting stops', 'Light snacks'],
    maxGuests: 6,
    times: ['11:00 AM', '2:00 PM', '4:00 PM']
  }
};

export default function TourDetail() {
  const params = useParams<{ slug: string }>();
  const tour = toursData[params.slug || ''];
  const { addItem } = useCart();
  
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tour Not Found</h1>
            <Link href="/tours">
              <Button>View All Tours</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!date || !time) {
      toast.error('Please select a date and time');
      return;
    }
    
    addItem({
      id: tour.id,
      type: 'tour',
      name: tour.name,
      price: tour.price * guests,
      quantity: 1,
      image: tour.image,
      tourDate: format(date, 'yyyy-MM-dd'),
      tourTime: time,
      guests
    });
    
    toast.success('Tour added to cart!');
  };

  const totalPrice = tour.price * guests;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Image */}
      <section className="relative h-[40vh] md:h-[50vh]">
        <img 
          src={tour.image} 
          alt={tour.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container">
            <Link href="/tours" className="inline-flex items-center text-white/80 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tours
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tour.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {tour.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Max {tour.maxGuests} guests
              </span>
              <span className="price-tag">${tour.price}/person</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                <p className="text-muted-foreground text-lg">{tour.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tour Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.highlights.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.included.map((item: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Meeting Point</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Let It Ride Electric Bikes</p>
                      <p className="text-muted-foreground">25 NW Minnesota Avenue #6, Bend, OR 97701</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please arrive 15 minutes before your scheduled tour time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Book This Tour</CardTitle>
                  <CardDescription>Select your date and time to reserve your spot</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <Label>Select Date</Label>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Select */}
                  <div className="space-y-2">
                    <Label>Select Time</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {tour.times.map((t: string) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <Label>Number of Guests</Label>
                    <Select value={guests.toString()} onValueChange={(v) => setGuests(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(tour.maxGuests)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between mb-2">
                      <span>${tour.price} × {guests} {guests === 1 ? 'guest' : 'guests'}</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground btn-glow"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Free cancellation up to 24 hours before
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="font-medium">189+ Reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', text: 'Amazing tour! Our guide was so knowledgeable and the e-bikes made it easy to enjoy without getting tired.' },
              { name: 'John D.', text: 'Perfect way to see Bend. We saw so much more than we would have on foot. Highly recommend!' },
              { name: 'Emily R.', text: 'The brewery tour was fantastic. Great selection of stops and our guide knew all the best spots.' }
            ].map((review, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-3">"{review.text}"</p>
                  <p className="font-medium">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
