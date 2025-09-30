import { useState } from 'react';
import { voiceService } from '../lib/voice-service';
import { Button } from './ui/button';

export function VoiceAssistantButton() {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState<string>('');

  const handleClick = async () => {
    setResponse('');
    setIsListening(true);
    try {
      const transcript = await voiceService.startListening();
      setIsListening(false);
      setResponse('Heard: ' + transcript);
      const result = await voiceService.processCommand(transcript);
      setResponse(result.text);
      await voiceService.speak(result.text);
    } catch (err: any) {
      setIsListening(false);
      setResponse(err.message || 'Voice recognition not supported.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleClick} disabled={isListening} className="rounded-full px-6 py-3 text-lg bg-primary text-white shadow-lg hover:bg-primary/80 transition">
        {isListening ? 'Listening...' : 'Aira voice Assistant'}
      </Button>
      {response && (
        <div className="mt-2 text-sm text-muted-foreground max-w-xs text-center">{response}</div>
      )}
    </div>
  );
}
