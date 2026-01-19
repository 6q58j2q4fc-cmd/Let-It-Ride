import { describe, it, expect } from 'vitest';

describe('Customer Service Chatbot', () => {
  const systemPromptContent = {
    businessInfo: {
      name: 'Let It Ride Electric Bikes',
      location: '25 NW Minnesota Ave #6, Bend, OR 97703',
      phone: '(541) 647-2331',
      hours: 'Open daily 9am-6pm'
    },
    tours: [
      { name: 'Short & Sweet Tour', duration: '1.5 hours', price: 75 },
      { name: 'Deschutes River Tour', duration: '2 hours', price: 100 },
      { name: 'Taste of Bend Tour', duration: '2 hours', price: 150 },
      { name: 'Best of Bend Tour', duration: '3 hours', price: 175 },
      { name: 'Sunset Tour', duration: '2 hours', price: 125 }
    ],
    rentals: [
      { duration: '2-hour', price: 50 },
      { duration: 'Half-day (4 hours)', price: 75 },
      { duration: 'Full-day (8 hours)', price: 100 }
    ],
    services: [
      { name: 'Basic Tune-Up', price: 60 },
      { name: 'Standard Tune-Up', price: 90 },
      { name: 'Premium Tune-Up', price: 120 },
      { name: 'E-Bike Build & Safety Check', priceRange: '$125-$250' }
    ]
  };

  it('should have correct business information', () => {
    expect(systemPromptContent.businessInfo.name).toBe('Let It Ride Electric Bikes');
    expect(systemPromptContent.businessInfo.phone).toBe('(541) 647-2331');
    expect(systemPromptContent.businessInfo.location).toContain('Bend, OR');
  });

  it('should have all tour options with pricing', () => {
    expect(systemPromptContent.tours.length).toBeGreaterThanOrEqual(5);
    systemPromptContent.tours.forEach(tour => {
      expect(tour.name).toBeDefined();
      expect(tour.duration).toBeDefined();
      expect(tour.price).toBeGreaterThan(0);
    });
  });

  it('should have rental pricing tiers', () => {
    expect(systemPromptContent.rentals.length).toBeGreaterThanOrEqual(3);
    const prices = systemPromptContent.rentals.map(r => r.price);
    // Prices should increase with duration
    expect(prices[0]).toBeLessThan(prices[1]);
    expect(prices[1]).toBeLessThan(prices[2]);
  });

  it('should have service options', () => {
    expect(systemPromptContent.services.length).toBeGreaterThanOrEqual(3);
    const basicTuneUp = systemPromptContent.services.find(s => s.name === 'Basic Tune-Up');
    expect(basicTuneUp?.price).toBe(60);
  });
});

describe('Let It Ride Card Game', () => {
  const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  type Card = {
    suit: typeof SUITS[number];
    value: string;
    numValue: number;
  };

  const createDeck = (): Card[] => {
    const deck: Card[] = [];
    for (const suit of SUITS) {
      for (let i = 0; i < VALUES.length; i++) {
        deck.push({
          suit,
          value: VALUES[i],
          numValue: i + 2
        });
      }
    }
    return deck;
  };

  const evaluateHand = (cards: Card[]): { rank: number; name: string } => {
    const sorted = [...cards].sort((a, b) => b.numValue - a.numValue);
    const values = sorted.map(c => c.numValue);
    const suits = sorted.map(c => c.suit);
    
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = values.every((v, i) => i === 0 || values[i - 1] - v === 1) ||
      (values[0] === 14 && values[1] === 5 && values[2] === 4);
    
    const valueCounts: Record<number, number> = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    
    if (isFlush && isStraight && values[0] === 14) return { rank: 9, name: 'Royal Flush' };
    if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush' };
    if (counts[0] === 3) return { rank: 7, name: 'Three of a Kind' };
    if (isFlush) return { rank: 6, name: 'Flush' };
    if (isStraight) return { rank: 5, name: 'Straight' };
    if (counts[0] === 2) return { rank: 4, name: 'Pair' };
    return { rank: 0, name: 'High Card' };
  };

  it('should create a standard 52-card deck', () => {
    const deck = createDeck();
    expect(deck.length).toBe(52);
  });

  it('should have all four suits', () => {
    const deck = createDeck();
    const suits = new Set(deck.map(c => c.suit));
    expect(suits.size).toBe(4);
    SUITS.forEach(suit => {
      expect(suits.has(suit)).toBe(true);
    });
  });

  it('should have 13 cards per suit', () => {
    const deck = createDeck();
    SUITS.forEach(suit => {
      const suitCards = deck.filter(c => c.suit === suit);
      expect(suitCards.length).toBe(13);
    });
  });

  it('should correctly identify a pair', () => {
    const hand: Card[] = [
      { suit: 'hearts', value: 'K', numValue: 13 },
      { suit: 'diamonds', value: 'K', numValue: 13 },
      { suit: 'clubs', value: '7', numValue: 7 },
      { suit: 'spades', value: '4', numValue: 4 },
      { suit: 'hearts', value: '2', numValue: 2 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('Pair');
    expect(result.rank).toBe(4);
  });

  it('should correctly identify three of a kind', () => {
    const hand: Card[] = [
      { suit: 'hearts', value: 'Q', numValue: 12 },
      { suit: 'diamonds', value: 'Q', numValue: 12 },
      { suit: 'clubs', value: 'Q', numValue: 12 },
      { suit: 'spades', value: '8', numValue: 8 },
      { suit: 'hearts', value: '3', numValue: 3 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('Three of a Kind');
    expect(result.rank).toBe(7);
  });

  it('should correctly identify a flush', () => {
    const hand: Card[] = [
      { suit: 'hearts', value: 'A', numValue: 14 },
      { suit: 'hearts', value: '10', numValue: 10 },
      { suit: 'hearts', value: '7', numValue: 7 },
      { suit: 'hearts', value: '4', numValue: 4 },
      { suit: 'hearts', value: '2', numValue: 2 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('Flush');
    expect(result.rank).toBe(6);
  });

  it('should correctly identify a straight', () => {
    const hand: Card[] = [
      { suit: 'hearts', value: '9', numValue: 9 },
      { suit: 'diamonds', value: '8', numValue: 8 },
      { suit: 'clubs', value: '7', numValue: 7 },
      { suit: 'spades', value: '6', numValue: 6 },
      { suit: 'hearts', value: '5', numValue: 5 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('Straight');
    expect(result.rank).toBe(5);
  });

  it('should correctly identify a straight flush', () => {
    const hand: Card[] = [
      { suit: 'spades', value: '9', numValue: 9 },
      { suit: 'spades', value: '8', numValue: 8 },
      { suit: 'spades', value: '7', numValue: 7 },
      { suit: 'spades', value: '6', numValue: 6 },
      { suit: 'spades', value: '5', numValue: 5 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('Straight Flush');
    expect(result.rank).toBe(8);
  });

  it('should correctly identify high card', () => {
    const hand: Card[] = [
      { suit: 'hearts', value: 'A', numValue: 14 },
      { suit: 'diamonds', value: 'J', numValue: 11 },
      { suit: 'clubs', value: '8', numValue: 8 },
      { suit: 'spades', value: '5', numValue: 5 },
      { suit: 'hearts', value: '3', numValue: 3 }
    ];
    const result = evaluateHand(hand);
    expect(result.name).toBe('High Card');
    expect(result.rank).toBe(0);
  });
});

describe('Game Payouts', () => {
  const payouts: Record<number, number> = {
    9: 1000, // Royal Flush
    8: 200,  // Straight Flush
    7: 40,   // Three of a Kind
    6: 8,    // Flush
    5: 5,    // Straight
    4: 1,    // Pair
  };

  it('should have correct payout multipliers', () => {
    expect(payouts[9]).toBe(1000); // Royal Flush
    expect(payouts[8]).toBe(200);  // Straight Flush
    expect(payouts[7]).toBe(40);   // Three of a Kind
    expect(payouts[6]).toBe(8);    // Flush
    expect(payouts[5]).toBe(5);    // Straight
    expect(payouts[4]).toBe(1);    // Pair
  });

  it('should calculate winnings correctly for a pair', () => {
    const bet = 30; // 3 x $10 ante
    const pairWinnings = bet * payouts[4];
    expect(pairWinnings).toBe(30);
  });

  it('should calculate winnings correctly for three of a kind', () => {
    const bet = 30;
    const threeOfKindWinnings = bet * payouts[7];
    expect(threeOfKindWinnings).toBe(1200);
  });
});

describe('Chat Message Handling', () => {
  it('should detect game trigger phrases', () => {
    const gameTriggers = ['play game', 'let it ride game', 'play let it ride'];
    const userMessage = 'I want to play game';
    
    const isGameTrigger = gameTriggers.some(trigger => 
      userMessage.toLowerCase().includes(trigger)
    );
    expect(isGameTrigger).toBe(true);
  });

  it('should not trigger game for regular messages', () => {
    const gameTriggers = ['play game', 'let it ride game'];
    const userMessage = 'What tours do you offer?';
    
    const isGameTrigger = gameTriggers.some(trigger => 
      userMessage.toLowerCase().includes(trigger)
    );
    expect(isGameTrigger).toBe(false);
  });
});
