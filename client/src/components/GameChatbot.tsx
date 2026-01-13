import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Gamepad2, X, Gift, RotateCcw, Trophy, Sparkles } from 'lucide-react';

type CardSuit = '♠' | '♥' | '♦' | '♣';
type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

interface PlayingCard {
  suit: CardSuit;
  value: CardValue;
  faceUp: boolean;
}

const suits: CardSuit[] = ['♠', '♥', '♦', '♣'];
const values: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const prizes = [
  { hand: 'Royal Flush', prize: 'FREE TOUR', code: 'FREETOUR' },
  { hand: 'Straight Flush', prize: 'BOGO Tour', code: 'BOGO50' },
  { hand: 'Four of a Kind', prize: '25% Off', code: 'WIN25' },
  { hand: 'Full House', prize: '20% Off', code: 'WIN20' },
  { hand: 'Flush', prize: '15% Off', code: 'WIN15' },
  { hand: 'Straight', prize: '10% Off', code: 'WIN10' },
  { hand: 'Three of a Kind', prize: '10% Off', code: 'WIN10' },
  { hand: 'Two Pair', prize: '5% Off', code: 'WIN5' },
  { hand: 'Pair (10s or Better)', prize: '5% Off', code: 'WIN5' }
];

export function GameChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'intro' | 'deal' | 'bet1' | 'bet2' | 'result'>('intro');
  const [cards, setCards] = useState<PlayingCard[]>([]);
  const [bet1, setBet1] = useState(true);
  const [bet2, setBet2] = useState(true);
  const [result, setResult] = useState<{ hand: string; prize: string; code: string } | null>(null);
  const [playsToday, setPlaysToday] = useState(0);

  useEffect(() => {
    const plays = localStorage.getItem('letitride_plays_today');
    const playDate = localStorage.getItem('letitride_play_date');
    const today = new Date().toDateString();
    
    if (playDate !== today) {
      localStorage.setItem('letitride_play_date', today);
      localStorage.setItem('letitride_plays_today', '0');
      setPlaysToday(0);
    } else if (plays) {
      setPlaysToday(parseInt(plays));
    }
  }, []);

  const createDeck = (): PlayingCard[] => {
    const deck: PlayingCard[] = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value, faceUp: false });
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  };

  const dealCards = () => {
    if (playsToday >= 3) {
      toast.error('You\'ve used all 3 plays for today. Come back tomorrow!');
      return;
    }

    const deck = createDeck();
    const hand = deck.slice(0, 5).map((card, i) => ({
      ...card,
      faceUp: i < 3 // First 3 cards face up
    }));
    setCards(hand);
    setGameState('bet1');
    setBet1(true);
    setBet2(true);
    setResult(null);
  };

  const revealCard = (index: number) => {
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, faceUp: true } : card
    ));
  };

  const handleBet1 = (letItRide: boolean) => {
    setBet1(letItRide);
    revealCard(3);
    setGameState('bet2');
  };

  const handleBet2 = (letItRide: boolean) => {
    setBet2(letItRide);
    revealCard(4);
    evaluateHand();
    setGameState('result');
    
    // Update plays count
    const newPlays = playsToday + 1;
    setPlaysToday(newPlays);
    localStorage.setItem('letitride_plays_today', newPlays.toString());
  };

  const getCardValue = (value: CardValue): number => {
    if (value === 'A') return 14;
    if (value === 'K') return 13;
    if (value === 'Q') return 12;
    if (value === 'J') return 11;
    return parseInt(value);
  };

  const evaluateHand = () => {
    const hand = cards.map(c => ({ ...c, faceUp: true }));
    const sortedValues = hand.map(c => getCardValue(c.value)).sort((a, b) => b - a);
    const suits = hand.map(c => c.suit);
    const values = hand.map(c => c.value);
    
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = sortedValues.every((v, i) => i === 0 || sortedValues[i - 1] - v === 1) ||
                       (sortedValues[0] === 14 && sortedValues[1] === 5); // Ace-low straight
    
    const valueCounts: Record<string, number> = {};
    values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    
    let handResult: { hand: string; prize: string; code: string } | null = null;

    // Royal Flush (very rare - give it a small chance)
    if (isFlush && isStraight && sortedValues[0] === 14 && sortedValues[4] === 10) {
      handResult = prizes[0];
    }
    // Straight Flush
    else if (isFlush && isStraight) {
      handResult = prizes[1];
    }
    // Four of a Kind
    else if (counts[0] === 4) {
      handResult = prizes[2];
    }
    // Full House
    else if (counts[0] === 3 && counts[1] === 2) {
      handResult = prizes[3];
    }
    // Flush
    else if (isFlush) {
      handResult = prizes[4];
    }
    // Straight
    else if (isStraight) {
      handResult = prizes[5];
    }
    // Three of a Kind
    else if (counts[0] === 3) {
      handResult = prizes[6];
    }
    // Two Pair
    else if (counts[0] === 2 && counts[1] === 2) {
      handResult = prizes[7];
    }
    // Pair of 10s or Better
    else if (counts[0] === 2) {
      const pairValue = Object.entries(valueCounts).find(([_, count]) => count === 2)?.[0];
      if (pairValue && getCardValue(pairValue as CardValue) >= 10) {
        handResult = prizes[8];
      }
    }

    // Random chance for a prize even with bad hand (10% chance)
    if (!handResult && Math.random() < 0.1) {
      handResult = { hand: 'Lucky Draw', prize: '5% Off', code: 'LUCKY5' };
    }

    setResult(handResult);
    setCards(hand);

    if (handResult) {
      toast.success(`Congratulations! You won ${handResult.prize}!`);
      localStorage.setItem('letitride_won_code', handResult.code);
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setCards([]);
    setResult(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const CardDisplay = ({ card, hidden = false }: { card: PlayingCard; hidden?: boolean }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    if (!card.faceUp || hidden) {
      return (
        <div className="w-14 h-20 bg-primary rounded-lg flex items-center justify-center border-2 border-primary-foreground/20">
          <span className="text-primary-foreground text-2xl">🚴</span>
        </div>
      );
    }
    
    return (
      <div className={`w-14 h-20 bg-white rounded-lg flex flex-col items-center justify-center border-2 border-gray-200 shadow-sm ${isRed ? 'text-red-600' : 'text-black'}`}>
        <span className="text-lg font-bold">{card.value}</span>
        <span className="text-xl">{card.suit}</span>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Gamepad2 className="h-6 w-6" />
      </button>

      {/* Game Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>

            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <CardTitle>Let It Ride!</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Play poker to win coupons & free tours!
              </p>
              <Badge variant="outline" className="w-fit mx-auto">
                {3 - playsToday} plays remaining today
              </Badge>
            </CardHeader>

            <CardContent>
              {gameState === 'intro' && (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-secondary rounded-lg">
                    <h4 className="font-semibold mb-2">How to Play</h4>
                    <ol className="text-sm text-left space-y-1 text-muted-foreground">
                      <li>1. Get dealt 5 cards (3 face up)</li>
                      <li>2. Decide to "Let It Ride" or pull back</li>
                      <li>3. 4th card revealed - decide again</li>
                      <li>4. 5th card revealed - see if you won!</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      Prizes
                    </h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Royal Flush</span>
                        <span className="font-bold text-accent">FREE TOUR!</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Straight Flush</span>
                        <span className="font-bold">BOGO Tour</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Four of a Kind</span>
                        <span className="font-bold">25% Off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Full House</span>
                        <span className="font-bold">20% Off</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pair (10s+)</span>
                        <span className="font-bold">5% Off</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={dealCards} 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={playsToday >= 3}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Deal Cards
                  </Button>
                </div>
              )}

              {(gameState === 'bet1' || gameState === 'bet2') && (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {cards.map((card, i) => (
                      <CardDisplay key={i} card={card} />
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      {gameState === 'bet1' 
                        ? 'Look at your first 3 cards. Let it ride or pull back?' 
                        : 'Card 4 revealed! Let it ride or pull back?'}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => gameState === 'bet1' ? handleBet1(true) : handleBet2(true)}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Let It Ride!
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => gameState === 'bet1' ? handleBet1(false) : handleBet2(false)}
                      >
                        Pull Back
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {gameState === 'result' && (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {cards.map((card, i) => (
                      <CardDisplay key={i} card={card} />
                    ))}
                  </div>

                  {result ? (
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                      <h3 className="text-xl font-bold mb-1">{result.hand}!</h3>
                      <p className="text-lg font-semibold text-accent mb-3">You won: {result.prize}</p>
                      <div 
                        onClick={() => copyCode(result.code)}
                        className="bg-white p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <p className="font-mono font-bold text-lg">{result.code}</p>
                        <p className="text-xs text-muted-foreground">Click to copy</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-secondary rounded-lg">
                      <p className="text-lg font-medium mb-2">No winning hand this time</p>
                      <p className="text-sm text-muted-foreground">
                        Try again! You have {3 - playsToday} plays left today.
                      </p>
                    </div>
                  )}

                  <Button onClick={resetGame} variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
