import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { trpc } from '@/lib/trpc';
import { 
  MessageCircle, X, Send, Loader2, Bike, Gamepad2,
  ArrowLeft, DollarSign, Plus, Minus, RotateCcw
} from 'lucide-react';
import { Streamdown } from 'streamdown';

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Card game types
type Card = {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: string;
  numValue: number;
};

type GameState = {
  deck: Card[];
  playerCards: Card[];
  dealerCards: Card[];
  communityCards: Card[];
  ante: number;
  pairPlusBet: number;
  playBet: number;
  phase: 'betting' | 'dealt' | 'decision' | 'reveal' | 'result';
  balance: number;
  result: string | null;
  winnings: number;
};

const SUITS: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
  return shuffleDeck(deck);
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

const getSuitSymbol = (suit: Card['suit']) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

const getSuitColor = (suit: Card['suit']) => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-gray-900';
};

const evaluateHand = (cards: Card[]): { rank: number; name: string } => {
  const sorted = [...cards].sort((a, b) => b.numValue - a.numValue);
  const values = sorted.map(c => c.numValue);
  const suits = sorted.map(c => c.suit);
  
  const isFlush = suits.every(s => s === suits[0]);
  const isStraight = values.every((v, i) => i === 0 || values[i - 1] - v === 1) ||
    (values[0] === 14 && values[1] === 5 && values[2] === 4); // A-2-3
  
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

const PlayingCard = ({ card, hidden = false }: { card: Card; hidden?: boolean }) => {
  if (hidden) {
    return (
      <div className="w-12 h-16 bg-gradient-to-br from-primary to-green-700 rounded-lg border-2 border-white shadow-md flex items-center justify-center">
        <Bike className="w-6 h-6 text-white/80" />
      </div>
    );
  }
  
  return (
    <div className="w-12 h-16 bg-white rounded-lg border border-gray-300 shadow-md flex flex-col items-center justify-center">
      <span className={cn("text-sm font-bold", getSuitColor(card.suit))}>
        {card.value}
      </span>
      <span className={cn("text-lg", getSuitColor(card.suit))}>
        {getSuitSymbol(card.suit)}
      </span>
    </div>
  );
};

const LetItRideGame = ({ onClose }: { onClose: () => void }) => {
  const [game, setGame] = useState<GameState>({
    deck: createDeck(),
    playerCards: [],
    dealerCards: [],
    communityCards: [],
    ante: 10,
    pairPlusBet: 0,
    playBet: 0,
    phase: 'betting',
    balance: 1000,
    result: null,
    winnings: 0
  });

  const deal = () => {
    const newDeck = createDeck();
    const playerCards = [newDeck.pop()!, newDeck.pop()!, newDeck.pop()!];
    const communityCards = [newDeck.pop()!, newDeck.pop()!];
    
    setGame(prev => ({
      ...prev,
      deck: newDeck,
      playerCards,
      communityCards,
      playBet: prev.ante * 3, // 3 equal bets
      balance: prev.balance - prev.ante * 3 - prev.pairPlusBet,
      phase: 'dealt',
      result: null,
      winnings: 0
    }));
  };

  const letItRide = () => {
    if (game.phase === 'dealt') {
      setGame(prev => ({ ...prev, phase: 'decision' }));
    } else if (game.phase === 'decision') {
      // Reveal all and calculate
      calculateResult();
    }
  };

  const pullBack = () => {
    if (game.phase === 'dealt') {
      setGame(prev => ({
        ...prev,
        playBet: prev.playBet - prev.ante,
        balance: prev.balance + prev.ante,
        phase: 'decision'
      }));
    } else if (game.phase === 'decision') {
      setGame(prev => ({
        ...prev,
        playBet: prev.playBet - prev.ante,
        balance: prev.balance + prev.ante
      }));
      calculateResult();
    }
  };

  const calculateResult = () => {
    const allCards = [...game.playerCards, ...game.communityCards];
    const hand = evaluateHand(allCards);
    
    let winnings = 0;
    let resultText = '';
    
    // Main bet payouts (simplified Let It Ride payouts)
    const payouts: Record<number, number> = {
      9: 1000, // Royal Flush
      8: 200,  // Straight Flush
      7: 40,   // Three of a Kind
      6: 8,    // Flush
      5: 5,    // Straight
      4: 1,    // Pair (10s or better in real game, simplified here)
    };
    
    if (hand.rank >= 4) {
      const multiplier = payouts[hand.rank] || 0;
      winnings = game.playBet * multiplier;
      resultText = `${hand.name}! You win $${winnings}!`;
    } else {
      resultText = `${hand.name} - Better luck next time!`;
    }
    
    // Pair Plus bonus (if bet placed)
    if (game.pairPlusBet > 0 && hand.rank >= 4) {
      const bonusMultiplier = payouts[hand.rank] || 0;
      const bonus = game.pairPlusBet * bonusMultiplier;
      winnings += bonus;
      if (bonus > 0) {
        resultText += ` Pair Plus bonus: $${bonus}!`;
      }
    }
    
    setGame(prev => ({
      ...prev,
      phase: 'result',
      result: resultText,
      winnings,
      balance: prev.balance + winnings
    }));
  };

  const newGame = () => {
    setGame(prev => ({
      ...prev,
      deck: createDeck(),
      playerCards: [],
      communityCards: [],
      playBet: 0,
      phase: 'betting',
      result: null,
      winnings: 0
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-800 to-green-900 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Chat
        </Button>
        <div className="flex items-center gap-2 text-white">
          <DollarSign className="w-4 h-4" />
          <span className="font-bold">${game.balance}</span>
        </div>
      </div>

      {/* Game Title */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">Let It Ride</h3>
        <p className="text-white/70 text-xs">Get a pair of 10s or better to win!</p>
      </div>

      {/* Community Cards */}
      <div className="flex justify-center gap-2 mb-4">
        <div className="text-center">
          <p className="text-white/70 text-xs mb-1">Community Cards</p>
          <div className="flex gap-1 justify-center">
            {game.communityCards.length > 0 ? (
              <>
                <PlayingCard 
                  card={game.communityCards[0]} 
                  hidden={game.phase === 'dealt'} 
                />
                <PlayingCard 
                  card={game.communityCards[1]} 
                  hidden={game.phase === 'dealt' || game.phase === 'decision'} 
                />
              </>
            ) : (
              <>
                <div className="w-12 h-16 border-2 border-dashed border-white/30 rounded-lg" />
                <div className="w-12 h-16 border-2 border-dashed border-white/30 rounded-lg" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Player Cards */}
      <div className="flex justify-center gap-2 mb-4">
        <div className="text-center">
          <p className="text-white/70 text-xs mb-1">Your Cards</p>
          <div className="flex gap-1 justify-center">
            {game.playerCards.length > 0 ? (
              game.playerCards.map((card, i) => (
                <PlayingCard key={i} card={card} />
              ))
            ) : (
              <>
                <div className="w-12 h-16 border-2 border-dashed border-white/30 rounded-lg" />
                <div className="w-12 h-16 border-2 border-dashed border-white/30 rounded-lg" />
                <div className="w-12 h-16 border-2 border-dashed border-white/30 rounded-lg" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Betting Area */}
      {game.phase === 'betting' && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
            <span className="text-white text-sm">Ante Bet:</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white"
                onClick={() => setGame(prev => ({ ...prev, ante: Math.max(5, prev.ante - 5) }))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-white font-bold w-12 text-center">${game.ante}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white"
                onClick={() => setGame(prev => ({ ...prev, ante: Math.min(100, prev.ante + 5) }))}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-white/10 rounded-lg p-2">
            <span className="text-white text-sm">Pair Plus (Optional):</span>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white"
                onClick={() => setGame(prev => ({ ...prev, pairPlusBet: Math.max(0, prev.pairPlusBet - 5) }))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-white font-bold w-12 text-center">${game.pairPlusBet}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 text-white"
                onClick={() => setGame(prev => ({ ...prev, pairPlusBet: Math.min(50, prev.pairPlusBet + 5) }))}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-white/60 text-xs text-center">
            Total bet: ${game.ante * 3 + game.pairPlusBet}
          </p>
        </div>
      )}

      {/* Current Bets Display */}
      {game.phase !== 'betting' && (
        <div className="flex justify-center gap-4 mb-4">
          <div className="text-center">
            <p className="text-white/70 text-xs">Bets</p>
            <p className="text-yellow-400 font-bold">${game.playBet}</p>
          </div>
          {game.pairPlusBet > 0 && (
            <div className="text-center">
              <p className="text-white/70 text-xs">Pair Plus</p>
              <p className="text-yellow-400 font-bold">${game.pairPlusBet}</p>
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {game.result && (
        <div className={cn(
          "text-center p-3 rounded-lg mb-4",
          game.winnings > 0 ? "bg-yellow-500/20" : "bg-red-500/20"
        )}>
          <p className={cn(
            "font-bold",
            game.winnings > 0 ? "text-yellow-400" : "text-red-400"
          )}>
            {game.result}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto space-y-2">
        {game.phase === 'betting' && (
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            onClick={deal}
            disabled={game.balance < game.ante * 3 + game.pairPlusBet}
          >
            Deal Cards
          </Button>
        )}
        
        {(game.phase === 'dealt' || game.phase === 'decision') && (
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
              onClick={letItRide}
            >
              Let It Ride
            </Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
              onClick={pullBack}
            >
              Pull Back ${game.ante}
            </Button>
          </div>
        )}
        
        {game.phase === 'result' && (
          <Button 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            onClick={newGame}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        )}
      </div>
    </div>
  );
};

export function CustomerServiceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.send.useMutation({
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content
      }]);
    },
    onError: () => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or call us at (541) 647-2331."
      }]);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || chatMutation.isPending) return;

    // Check for game trigger
    if (trimmed.toLowerCase().includes('play game') || trimmed.toLowerCase().includes('let it ride game')) {
      setMessages(prev => [...prev, 
        { role: 'user', content: trimmed },
        { role: 'assistant', content: "🎰 Great choice! Let's play Let It Ride! Click the button below to start the game. Good luck! 🍀" }
      ]);
      setInput('');
      setTimeout(() => setShowGame(true), 1000);
      return;
    }

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    
    chatMutation.mutate({ messages: newMessages });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const suggestedPrompts = [
    "What tours do you offer?",
    "How much are rentals?",
    "Tell me about Pedego bikes",
    "Book a service appointment"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] flex flex-col shadow-2xl border-2 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Let It Ride Support</h3>
                <p className="text-xs text-white/80">We typically reply instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setShowGame(!showGame)}
                title="Play Let It Ride Game"
              >
                <Gamepad2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          {showGame ? (
            <LetItRideGame onClose={() => setShowGame(false)} />
          ) : (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Bike className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Welcome to Let It Ride!</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      How can we help you today? Ask about tours, rentals, bikes, or service.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(prompt)}
                          className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowGame(true)}
                      className="mt-4 text-xs px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-colors flex items-center gap-2"
                    >
                      <Gamepad2 className="w-3 h-3" />
                      Play Let It Ride Game
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex gap-2",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bike className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            msg.role === 'user'
                              ? "bg-primary text-white"
                              : "bg-muted"
                          )}
                        >
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <Streamdown>{msg.content}</Streamdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatMutation.isPending && (
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bike className="w-4 h-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-3 border-t bg-background">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                  className="flex gap-2"
                >
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 min-h-[40px] max-h-[100px] resize-none text-sm"
                    rows={1}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={!input.trim() || chatMutation.isPending}
                    className="h-10 w-10"
                  >
                    {chatMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
