import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { Camera, MapPin, Bike, Mountain, Beer, Building2, X, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: '/about-storefront-hello-fun.webp',
    title: 'Let It Ride Storefront',
    category: 'store',
    description: 'Our welcoming storefront in downtown Bend, ready to help you find your perfect e-bike adventure.',
  },
  {
    id: 2,
    src: '/ebike-tours-scenic.webp',
    title: 'E-Bikes by the Deschutes River',
    category: 'tours',
    description: 'Our fleet of Pedego e-bikes lined up for a scenic river tour along the beautiful Deschutes.',
  },
  {
    id: 3,
    src: '/showroom-rentals.webp',
    title: 'Pedego Electric Bikes Bend',
    category: 'store',
    description: 'The official Pedego dealer in Bend, Oregon - your destination for premium electric bikes.',
  },
  {
    id: 4,
    src: '/pedego-boomerang-red.webp',
    title: 'Pedego Interceptor',
    category: 'bikes',
    description: 'The classic Pedego Interceptor - comfortable cruising with powerful electric assist.',
  },
  {
    id: 5,
    src: '/tour-rental-center.webp',
    title: 'Trail Adventure',
    category: 'tours',
    description: 'Exploring the stunning trails around Central Oregon on our guided e-bike tours.',
  },
  {
    id: 6,
    src: '/hero-group-bikes.webp',
    title: 'Cascade Mountain Views',
    category: 'scenery',
    description: 'The breathtaking Cascade Mountains provide a stunning backdrop for every ride in Bend.',
  },
  {
    id: 7,
    src: '/ebike-rentals-shop.webp',
    title: 'Bend Brewery Scene',
    category: 'tours',
    description: 'Stop by one of Bend\'s famous craft breweries on our Taste of Bend tour.',
  },
  {
    id: 8,
    src: '/pedego-tandem-red.webp',
    title: 'Deschutes Brewery',
    category: 'tours',
    description: 'The iconic Deschutes Brewery - a highlight of our Taste of Bend brewery tour.',
  },
  {
    id: 9,
    src: '/pedego-bend-hello-fun-logo.webp',
    title: 'Old Mill District',
    category: 'scenery',
    description: 'The beautiful Old Mill District along the Deschutes River - a favorite stop on our tours.',
  },
  {
    id: 10,
    src: '/hero-group-bikes.webp',
    title: 'Deschutes River at Old Mill',
    category: 'scenery',
    description: 'Kayakers and paddleboarders enjoy the Deschutes River near the Old Mill District.',
  },
];

const categories = [
  { id: 'all', label: 'All Photos', icon: Camera },
  { id: 'tours', label: 'Tours', icon: Bike },
  { id: 'bikes', label: 'E-Bikes', icon: Zap },
  { id: 'store', label: 'Our Store', icon: Building2 },
  { id: 'scenery', label: 'Bend Scenery', icon: Mountain },
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: typeof galleryImages[0], index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredImages.length) % filteredImages.length
      : (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/gallery/cascade-mountains.jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">Photo Gallery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Explore Bend on Two Wheels
            </h1>
            <p className="text-xl text-muted-foreground">
              See the beauty of Central Oregon through our e-bike tours. From stunning mountain views 
              to craft brewery stops, discover why Bend is the perfect destination for electric bike adventures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b bg-card/50 sticky top-16 z-30 backdrop-blur-sm">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="overflow-hidden cursor-pointer group border-primary/10 hover:border-primary/30 transition-all duration-300"
                    onClick={() => openLightbox(image, index)}
                  >
                    <CardContent className="p-0 relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{selectedImage?.title || 'Gallery Image'}</DialogTitle>
          {selectedImage && (
            <div className="relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => navigateLightbox('prev')}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                onClick={() => navigateLightbox('next')}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              {/* Image */}
              <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Caption */}
              <div className="p-6 text-center">
                <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
                <p className="text-white/70">{selectedImage.description}</p>
                <div className="flex items-center justify-center gap-2 mt-4 text-white/50 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Bend, Oregon</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Own Memories?</h2>
            <p className="text-muted-foreground mb-8">
              Book an e-bike tour today and experience the beauty of Bend, Oregon firsthand. 
              Don't forget to bring your camera!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="/tours">
                  <Bike className="w-5 h-5 mr-2" />
                  Book a Tour
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/rentals">
                  <Zap className="w-5 h-5 mr-2" />
                  Rent an E-Bike
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
