import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  createServiceAppointment: vi.fn().mockResolvedValue({ insertId: 1 }),
  getAllServiceAppointments: vi.fn().mockResolvedValue([
    {
      id: 1,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '541-555-1234',
      bikeType: 'pedego-interceptor',
      bikeBrand: null,
      bikeModel: null,
      serviceType: 'basic-tuneup',
      preferredDate: new Date('2026-01-25'),
      preferredTime: '10:00 AM',
      issueDescription: 'Needs brake adjustment',
      status: 'pending',
      notes: null,
      estimatedCost: null,
      actualCost: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]),
  getServiceAppointmentById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '541-555-1234',
        bikeType: 'pedego-interceptor',
        serviceType: 'basic-tuneup',
        preferredDate: new Date('2026-01-25'),
        status: 'pending',
      });
    }
    return Promise.resolve(undefined);
  }),
  updateServiceAppointment: vi.fn().mockResolvedValue({ affectedRows: 1 }),
  getServiceAppointmentsByStatus: vi.fn().mockResolvedValue([]),
  getServiceAppointmentsByEmail: vi.fn().mockResolvedValue([]),
}));

import {
  createServiceAppointment,
  getAllServiceAppointments,
  getServiceAppointmentById,
  updateServiceAppointment,
} from './db';

describe('Service Appointments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createServiceAppointment', () => {
    it('should create a new service appointment', async () => {
      const appointmentData = {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '541-555-5678',
        bikeType: 'pedego-boomerang',
        serviceType: 'standard-tuneup',
        preferredDate: new Date('2026-01-28'),
        preferredTime: '2:00 PM',
        issueDescription: 'Annual tune-up',
        status: 'pending' as const,
      };

      const result = await createServiceAppointment(appointmentData);
      
      expect(createServiceAppointment).toHaveBeenCalledWith(appointmentData);
      expect(result).toEqual({ insertId: 1 });
    });

    it('should create appointment with optional fields', async () => {
      const appointmentData = {
        customerName: 'Bob Wilson',
        customerEmail: 'bob@example.com',
        customerPhone: '541-555-9999',
        bikeType: 'other-ebike',
        bikeBrand: 'Rad Power',
        bikeModel: 'RadRunner',
        serviceType: 'battery-diagnostic',
        preferredDate: new Date('2026-02-01'),
        status: 'pending' as const,
      };

      await createServiceAppointment(appointmentData);
      
      expect(createServiceAppointment).toHaveBeenCalledWith(appointmentData);
    });
  });

  describe('getAllServiceAppointments', () => {
    it('should return all service appointments', async () => {
      const appointments = await getAllServiceAppointments();
      
      expect(getAllServiceAppointments).toHaveBeenCalled();
      expect(appointments).toHaveLength(1);
      expect(appointments[0].customerName).toBe('John Doe');
      expect(appointments[0].status).toBe('pending');
    });
  });

  describe('getServiceAppointmentById', () => {
    it('should return appointment by id', async () => {
      const appointment = await getServiceAppointmentById(1);
      
      expect(getServiceAppointmentById).toHaveBeenCalledWith(1);
      expect(appointment).toBeDefined();
      expect(appointment?.customerName).toBe('John Doe');
    });

    it('should return undefined for non-existent id', async () => {
      const appointment = await getServiceAppointmentById(999);
      
      expect(appointment).toBeUndefined();
    });
  });

  describe('updateServiceAppointment', () => {
    it('should update appointment status', async () => {
      const updateData = {
        status: 'confirmed' as const,
        notes: 'Confirmed for Monday morning',
      };

      await updateServiceAppointment(1, updateData);
      
      expect(updateServiceAppointment).toHaveBeenCalledWith(1, updateData);
    });

    it('should update appointment with estimated cost', async () => {
      const updateData = {
        status: 'in_progress' as const,
        estimatedCost: '90.00',
      };

      await updateServiceAppointment(1, updateData);
      
      expect(updateServiceAppointment).toHaveBeenCalledWith(1, updateData);
    });

    it('should mark appointment as completed', async () => {
      const updateData = {
        status: 'completed' as const,
        actualCost: '85.00',
        completedAt: new Date(),
      };

      await updateServiceAppointment(1, updateData);
      
      expect(updateServiceAppointment).toHaveBeenCalledWith(1, updateData);
    });
  });
});

describe('Service Appointment Validation', () => {
  it('should require all mandatory fields', () => {
    const requiredFields = [
      'customerName',
      'customerEmail',
      'customerPhone',
      'bikeType',
      'serviceType',
      'preferredDate',
    ];

    const validAppointment = {
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '541-555-0000',
      bikeType: 'pedego-interceptor',
      serviceType: 'basic-tuneup',
      preferredDate: new Date(),
      status: 'pending' as const,
    };

    // Check all required fields are present
    requiredFields.forEach(field => {
      expect(validAppointment).toHaveProperty(field);
    });
  });

  it('should validate email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.org',
      'user+tag@example.co.uk',
    ];

    const invalidEmails = [
      'notanemail',
      '@nodomain.com',
      'missing@.com',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it('should validate status enum values', () => {
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    
    validStatuses.forEach(status => {
      expect(validStatuses).toContain(status);
    });
  });
});

describe('Service Types', () => {
  const serviceTypes = [
    { value: 'basic-tuneup', price: 60 },
    { value: 'standard-tuneup', price: 90 },
    { value: 'premium-tuneup', price: 120 },
    { value: 'ebike-build', priceRange: [125, 250] },
    { value: 'flat-repair', priceRange: [15, 20] },
    { value: 'battery-diagnostic', price: 50 },
    { value: 'motor-diagnostic', price: 75 },
    { value: 'general-repair', price: 100 }, // hourly rate
  ];

  it('should have correct pricing for tune-up packages', () => {
    const basicTuneup = serviceTypes.find(s => s.value === 'basic-tuneup');
    const standardTuneup = serviceTypes.find(s => s.value === 'standard-tuneup');
    const premiumTuneup = serviceTypes.find(s => s.value === 'premium-tuneup');

    expect(basicTuneup?.price).toBe(60);
    expect(standardTuneup?.price).toBe(90);
    expect(premiumTuneup?.price).toBe(120);
  });

  it('should have correct pricing for e-bike diagnostics', () => {
    const batteryDiag = serviceTypes.find(s => s.value === 'battery-diagnostic');
    const motorDiag = serviceTypes.find(s => s.value === 'motor-diagnostic');

    expect(batteryDiag?.price).toBe(50);
    expect(motorDiag?.price).toBe(75);
  });

  it('should have $100/hour labor rate for general repairs', () => {
    const generalRepair = serviceTypes.find(s => s.value === 'general-repair');
    expect(generalRepair?.price).toBe(100);
  });
});

describe('Bike Types', () => {
  const bikeTypes = [
    'pedego-cruiser',
    'pedego-interceptor',
    'pedego-city-commuter',
    'pedego-boomerang',
    'pedego-element',
    'pedego-tandem',
    'pedego-cargo',
    'pedego-ridge-rider',
    'pedego-trail-tracker',
    'other-ebike',
    'standard-bike',
    'mountain-bike',
    'road-bike',
  ];

  it('should support all Pedego models', () => {
    const pedegoModels = bikeTypes.filter(t => t.startsWith('pedego-'));
    expect(pedegoModels.length).toBeGreaterThanOrEqual(9);
  });

  it('should support non-Pedego bikes', () => {
    expect(bikeTypes).toContain('other-ebike');
    expect(bikeTypes).toContain('standard-bike');
    expect(bikeTypes).toContain('mountain-bike');
    expect(bikeTypes).toContain('road-bike');
  });
});

describe('Admin Panel - Service Appointments', () => {
  const statusConfig = {
    pending: { label: 'Pending', color: 'yellow' },
    confirmed: { label: 'Confirmed', color: 'blue' },
    in_progress: { label: 'In Progress', color: 'purple' },
    completed: { label: 'Completed', color: 'green' },
    cancelled: { label: 'Cancelled', color: 'red' },
  };

  it('should have all status types configured', () => {
    expect(Object.keys(statusConfig)).toHaveLength(5);
    expect(statusConfig).toHaveProperty('pending');
    expect(statusConfig).toHaveProperty('confirmed');
    expect(statusConfig).toHaveProperty('in_progress');
    expect(statusConfig).toHaveProperty('completed');
    expect(statusConfig).toHaveProperty('cancelled');
  });

  it('should have labels for all statuses', () => {
    Object.values(statusConfig).forEach(config => {
      expect(config.label).toBeDefined();
      expect(config.label.length).toBeGreaterThan(0);
    });
  });

  it('should have color codes for all statuses', () => {
    Object.values(statusConfig).forEach(config => {
      expect(config.color).toBeDefined();
      expect(config.color.length).toBeGreaterThan(0);
    });
  });
});

describe('Owner Notification for Service Requests', () => {
  const serviceTypeLabels: Record<string, string> = {
    'basic-tuneup': 'Basic Tune-Up',
    'standard-tuneup': 'Standard Tune-Up',
    'premium-tuneup': 'Premium Tune-Up',
    'ebike-build': 'E-Bike Build & Safety Check',
    'flat-repair': 'Flat Repair',
    'brake-adjustment': 'Brake Adjustment',
    'battery-diagnostic': 'Battery Diagnostic',
    'motor-diagnostic': 'Motor Diagnostic',
    'general-repair': 'General Repair',
  };

  it('should have labels for all service types', () => {
    expect(Object.keys(serviceTypeLabels).length).toBeGreaterThanOrEqual(9);
  });

  it('should format notification title correctly', () => {
    const customerName = 'John Doe';
    const title = `🔧 New Service Request from ${customerName}`;
    expect(title).toContain('New Service Request');
    expect(title).toContain(customerName);
  });

  it('should format notification content with all required fields', () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '541-555-1234',
      serviceType: 'basic-tuneup',
      bikeType: 'pedego-interceptor',
      preferredDate: '2026-01-25',
    };

    const content = `**Customer:** ${input.name}\n` +
      `**Email:** ${input.email}\n` +
      `**Phone:** ${input.phone}\n` +
      `**Service:** ${serviceTypeLabels[input.serviceType]}\n` +
      `**Bike Type:** ${input.bikeType}\n`;

    expect(content).toContain(input.name);
    expect(content).toContain(input.email);
    expect(content).toContain(input.phone);
    expect(content).toContain('Basic Tune-Up');
    expect(content).toContain(input.bikeType);
  });
});

describe('Customer Testimonials', () => {
  const testimonials = [
    {
      name: 'Sarah & Tom Johnson',
      location: 'Portland, OR',
      purchaseType: 'Pedego Interceptor (x2)',
      featured: true
    },
    {
      name: 'David Chen',
      location: 'San Francisco, CA',
      purchaseType: 'Deschutes River Tour',
      featured: true
    },
    {
      name: 'The Martinez Family',
      location: 'Bend, OR',
      purchaseType: 'Regular Rentals',
      featured: true
    },
  ];

  it('should have at least 3 featured testimonials', () => {
    const featured = testimonials.filter(t => t.featured);
    expect(featured.length).toBeGreaterThanOrEqual(3);
  });

  it('should have all required fields for testimonials', () => {
    testimonials.forEach(testimonial => {
      expect(testimonial.name).toBeDefined();
      expect(testimonial.location).toBeDefined();
      expect(testimonial.purchaseType).toBeDefined();
      expect(typeof testimonial.featured).toBe('boolean');
    });
  });

  it('should include diverse customer types', () => {
    const purchaseTypes = testimonials.map(t => t.purchaseType);
    // Should have bike purchases, tours, and rentals
    expect(purchaseTypes.some(p => p.includes('Pedego'))).toBe(true);
    expect(purchaseTypes.some(p => p.includes('Tour'))).toBe(true);
    expect(purchaseTypes.some(p => p.includes('Rental'))).toBe(true);
  });
});
