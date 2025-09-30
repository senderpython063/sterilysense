import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, MessageSquare, Lightbulb, AlertTriangle, CheckCircle, Send, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'optimization' | 'prediction';
  title: string;
  message: string;
  confidence: number;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AIInsightPanel: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'alert',
      title: 'High Contamination Risk Detected',
      message: 'Door Handle showing elevated bacterial load (1,840 CFU/cm²) with low UV intensity (65%). Humidity at 68% is reducing UV effectiveness. Recommend extending UV cycle by 2 minutes and increasing intensity to 85%.',
      confidence: 94,
      timestamp: '2 minutes ago',
      priority: 'high'
    },
    {
      id: '2',
      type: 'optimization',
      title: 'Energy Efficiency Optimization',
      message: 'TiO₂ coating effectiveness confirmed at 96%. Current UV cycle can be reduced by 15% while maintaining 99% disinfection efficacy. This will save 0.3 kWh per cycle.',
      confidence: 87,
      timestamp: '8 minutes ago',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Preventive Maintenance Alert',
      message: 'UV lamp degradation pattern suggests replacement needed in 45 days. Based on current usage (24 cycles/week), optimal replacement window is March 15-20 to prevent 15% efficiency loss.',
      confidence: 91,
      timestamp: '1 hour ago',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Humidity Control Suggestion',
      message: 'Installing humidity sensors in zones with >65% humidity could improve UV efficiency by 23%. ROI estimated at 4.2 months based on current chemical savings.',
      confidence: 78,
      timestamp: '3 hours ago',
      priority: 'low'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your SterilySense AI assistant. I can help you optimize UV cycles, interpret contamination data, and provide predictive maintenance insights. How can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulate new insights
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newInsightTemplates = [
          {
            type: 'optimization' as const,
            title: 'Cycle Timing Optimization',
            message: `Motion patterns suggest optimal disinfection window is 2:30-3:15 AM when room occupancy is 0%. Scheduling cycles during this period would improve safety protocols.`,
            priority: 'medium' as const
          },
          {
            type: 'alert' as const,
            title: 'Sensor Calibration Required',
            message: `UV sensor readings showing 3% drift from calibration baseline. Recommend recalibration within 48 hours to maintain accuracy.`,
            priority: 'high' as const
          },
          {
            type: 'recommendation' as const,
            title: 'Cost Saving Opportunity',
            message: `Bacterial load patterns indicate bed rail cleaning frequency can be reduced by 20% without compromising hygiene standards, saving $85/month.`,
            priority: 'low' as const
          }
        ];

        const template = newInsightTemplates[Math.floor(Math.random() * newInsightTemplates.length)];
        const newInsight: AIInsight = {
          id: Date.now().toString(),
          ...template,
          confidence: 80 + Math.random() * 20,
          timestamp: 'Just now'
        };

        setInsights(prev => [newInsight, ...prev.slice(0, 4)]);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on your current data, I recommend increasing UV intensity by 15% for the door handle area. The elevated humidity (68%) is reducing photocatalytic efficiency.',
        'The contamination pattern suggests a 2-hour cycle interval would be optimal. This balances energy efficiency with hygiene standards.',
        'Your TiO₂ coating is performing at 94% efficiency. Reapplication won\'t be needed for another 3 months based on current degradation rates.',
        'I\'ve analyzed the bacterial load trends. The IV stand area shows consistently low contamination - you could extend cycle intervals by 30% in that zone.',
        'Motion sensor data indicates the room is unoccupied between 2-4 AM. Scheduling intensive UV cycles during this window would improve safety compliance.'
      ];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'optimization': return <Lightbulb className="w-4 h-4" />;
      case 'recommendation': return <CheckCircle className="w-4 h-4" />;
      case 'prediction': return <Brain className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-danger bg-danger/20 text-danger-foreground';
      case 'medium': return 'border-warning bg-warning/20 text-warning-foreground';
      default: return 'border-success bg-success/20 text-success-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger text-danger-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  return (
    <Card className="glass-card border border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI Insight Panel</h3>
              <p className="text-sm text-muted-foreground">Intelligent Analysis & Recommendations</p>
            </div>
          </div>
          
          <Badge variant="outline" className="font-mono">
            <Brain className="w-3 h-3 mr-1" />
            GPT-4 Powered
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Latest Insights</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 rounded-lg border ${getInsightColor(insight.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(insight.priority)}`}
                        >
                          {insight.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-mono">
                          {insight.confidence}%
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 mb-2">{insight.message}</p>
                    <div className="text-xs text-muted-foreground">{insight.timestamp}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Chat */}
          <div className="flex flex-col">
            <h4 className="font-semibold text-foreground mb-4">Ask SterilySense AI</h4>
            
            {/* Chat Messages */}
            <div className="flex-1 max-h-80 overflow-y-auto border border-border/30 rounded-lg p-4 mb-4 space-y-3">
              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask about contamination patterns, optimization tips..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-3">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIInsightPanel;