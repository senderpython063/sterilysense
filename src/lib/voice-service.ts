// Voice service for AI assistant functionality
import { dataService } from './dataService';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface VoiceCommand {
  command: string;
  intent: string;
  entities: Record<string, any>;
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  data?: any;
  suggestions?: string[];
}

class VoiceService {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private language = 'en-US';

  // For ElevenLabs integration (will be added when API key is provided)
  private elevenLabsApiKey: string | null = null;
  private elevenLabsVoiceId = '9BWtsMINqrJLrRacOk9x'; // Aria voice

  // Command registry for dynamic commands
  private commandRegistry: Array<{
    pattern: RegExp | string;
    intent: string;
    handler: (command: VoiceCommand) => Promise<VoiceResponse>;
  }> = [];

  constructor() {
    this.initializeBrowserAPIs();
    this.registerDefaultCommands();
  }
  /**
   * Register a new command pattern and handler
   * @param pattern RegExp or string to match transcript
   * @param intent Intent name
   * @param handler Function to handle the command
   */
  registerCommand(pattern: RegExp | string, intent: string, handler: (command: VoiceCommand) => Promise<VoiceResponse>) {
    this.commandRegistry.push({ pattern, intent, handler });
  }

  /**
   * Register built-in commands (can be removed/edited)
   */
  private registerDefaultCommands() {
    // Display data
    this.registerCommand(/\b(show|display)\b/, 'display_data', async (command) => await this.handleDisplayData(command));
    // System status
    this.registerCommand(/\b(status|health)\b/, 'system_status', async () => await this.handleSystemStatus());
    // Summarize
    this.registerCommand(/\b(summarize|summary)\b/, 'summarize', async () => await this.handleSummarize());
    // Simulation
    this.registerCommand(/\b(simulate|what if)\b/, 'simulation', async () => await this.handleSimulation());
    // Export data
    this.registerCommand(/\b(export|download|report)\b/, 'export_data', async () => await this.handleExportData());
  }

  private initializeBrowserAPIs() {
    // Initialize Web Speech API as fallback
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.language;
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  setLanguage(language: string) {
    this.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }

  setElevenLabsApiKey(apiKey: string) {
    this.elevenLabsApiKey = apiKey;
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async processCommand(transcript: string): Promise<VoiceResponse> {
    const command = this.parseCommand(transcript);
    return await this.executeCommand(command);
  }

  private parseCommand(transcript: string): VoiceCommand {
    const lowerTranscript = transcript.toLowerCase();
    let intent = 'unknown';
    let entities: Record<string, any> = {};
    let confidence = 0.5;

    // Try to match against registered commands
    for (const entry of this.commandRegistry) {
      if (typeof entry.pattern === 'string') {
        if (lowerTranscript.includes(entry.pattern.toLowerCase())) {
          intent = entry.intent;
          confidence = 0.9;
          break;
        }
      } else if (entry.pattern instanceof RegExp) {
        if (entry.pattern.test(lowerTranscript)) {
          intent = entry.intent;
          confidence = 0.9;
          break;
        }
      }
    }

    // Extract entities (same as before)
    if (intent === 'display_data') {
      if (lowerTranscript.includes('contamination') || lowerTranscript.includes('pollution')) {
        entities.dataType = 'contamination';
      } else if (lowerTranscript.includes('alert') || lowerTranscript.includes('warning')) {
        entities.dataType = 'alerts';
      } else if (lowerTranscript.includes('zone') || lowerTranscript.includes('area')) {
        entities.dataType = 'zones';
      }
      if (lowerTranscript.includes('today')) entities.timePeriod = 'today';
      else if (lowerTranscript.includes('yesterday')) entities.timePeriod = 'yesterday';
      else if (lowerTranscript.includes('week') || lowerTranscript.includes('7 days')) entities.timePeriod = 'week';
      else if (lowerTranscript.includes('month')) entities.timePeriod = 'month';
    }

    return {
      command: transcript,
      intent,
      entities,
      confidence
    };
  }

  private async executeCommand(command: VoiceCommand): Promise<VoiceResponse> {
    try {
      // Try to find a handler in the registry
      const entry = this.commandRegistry.find(e => e.intent === command.intent);
      if (entry && entry.handler) {
        return await entry.handler(command);
      }
      // Fallback: unknown command
      return {
        text: "I'm sorry, I didn't understand that command. Try asking me to show contamination data, system status, or run a simulation.",
        suggestions: [
          "Show contamination levels",
          "What's the system status?",
          "Summarize today's alerts",
          "Export current report"
        ]
      };
    } catch (error) {
      return {
        text: "Sorry, I encountered an error processing your request. Please try again.",
        suggestions: ["Try a different command"]
      };
    }
  }

  private async handleDisplayData(command: VoiceCommand): Promise<VoiceResponse> {
    const data = await dataService.fetchSensorData();
    const { dataType, timePeriod } = command.entities;

    if (dataType === 'contamination' || dataType === 'zones') {
      const criticalZones = data.zones.filter(z => z.status === 'critical');
      const warningZones = data.zones.filter(z => z.status === 'warning');
      
      let response = `Found ${data.zones.length} monitoring zones. `;
      
      if (criticalZones.length > 0) {
        response += `${criticalZones.length} zones require immediate attention: ${criticalZones.map(z => z.name).join(', ')}. `;
      }
      
      if (warningZones.length > 0) {
        response += `${warningZones.length} zones show warning levels: ${warningZones.map(z => z.name).join(', ')}. `;
      }
      
      response += `Overall facility health is at ${data.analytics.overallHealth}%.`;
      
      return {
        text: response,
        data: data.zones,
        suggestions: ["Show alerts", "System status", "Export report"]
      };
    } else if (dataType === 'alerts') {
      const activeAlerts = data.alerts.filter(a => !a.acknowledged);
      
      let response = `Found ${activeAlerts.length} active alerts. `;
      
      if (activeAlerts.length > 0) {
        const critical = activeAlerts.filter(a => a.type === 'critical');
        const warnings = activeAlerts.filter(a => a.type === 'warning');
        
        if (critical.length > 0) {
          response += `${critical.length} critical alerts requiring immediate action. `;
        }
        if (warnings.length > 0) {
          response += `${warnings.length} warning alerts need attention. `;
        }
      } else {
        response += "All systems are running normally.";
      }
      
      return {
        text: response,
        data: activeAlerts,
        suggestions: ["Show contamination data", "System summary", "Acknowledge alerts"]
      };
    }

    return {
      text: "I can show you contamination levels, alerts, or zone status. What would you like to see?",
      suggestions: ["Show contamination levels", "Show active alerts", "Zone status"]
    };
  }

  private async handleSystemStatus(): Promise<VoiceResponse> {
    const data = await dataService.fetchSensorData();
    
    const response = `System status report: Overall health is ${data.analytics.overallHealth}%. 
    ${data.analytics.activeFeaturesCount} out of ${data.analytics.totalFeatures} AI features are active. 
    Energy efficiency is at ${data.analytics.energyEfficiency}%. 
    Detection accuracy is ${data.analytics.detectionAccuracy}%. 
    ${data.analytics.criticalZones} zones require immediate attention.`;
    
    return {
      text: response,
      data: data.analytics,
      suggestions: ["Show critical zones", "Export status report", "Show recommendations"]
    };
  }

  private async handleSummarize(): Promise<VoiceResponse> {
    const data = await dataService.fetchSensorData();
    
    const topInsights = data.aiInsights.slice(0, 3);
    let response = "Here's a summary of key insights: ";
    
    topInsights.forEach((insight, index) => {
      response += `${index + 1}. ${insight.insight} with ${insight.confidence.toFixed(1)}% confidence. `;
    });
    
    return {
      text: response,
      data: topInsights,
      suggestions: ["Show full insights", "Run analysis", "Export summary"]
    };
  }

  private async handleSimulation(): Promise<VoiceResponse> {
    return {
      text: "I can run simulations for UV treatment increases, chemical reduction, cleaning schedule optimization, or HVAC upgrades. Which simulation would you like me to run?",
      suggestions: [
        "Simulate UV increase",
        "Optimize cleaning schedule", 
        "Test chemical reduction",
        "HVAC upgrade simulation"
      ]
    };
  }

  private async handleExportData(): Promise<VoiceResponse> {
    try {
      await dataService.exportReport('json');
      return {
        text: "Report exported successfully. The file has been downloaded to your device.",
        suggestions: ["Show latest data", "System status", "Run analysis"]
      };
    } catch (error) {
      return {
        text: "Sorry, I couldn't export the report right now. Please try again later.",
        suggestions: ["Try again", "Show current data"]
      };
    }
  }

  async speak(text: string): Promise<void> {
    if (this.elevenLabsApiKey) {
      return this.speakWithElevenLabs(text);
    } else {
      return this.speakWithBrowserAPI(text);
    }
  }

  private async speakWithElevenLabs(text: string): Promise<void> {
    if (!this.elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not set');
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.elevenLabsVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        audio.play();
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      // Fallback to browser API
      return this.speakWithBrowserAPI(text);
    }
  }

  private async speakWithBrowserAPI(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      this.synthesis.speak(utterance);
    });
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  getSupportedLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en-US', name: 'English' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'ta-IN', name: 'Tamil' },
      { code: 'zh-CN', name: 'Chinese' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'pt-BR', name: 'Portuguese' }
    ];
  }
}

export const voiceService = new VoiceService();

// DEMO: Register a custom command for "turn on the lights"
// voiceService.registerCommand('turn on the lights', 'lights_on', async (command) => {
//   // Here you can add your own logic, e.g., call an API, update UI, etc.
//   return {
//     text: 'Turning on the lights now!',
//     suggestions: ['Turn off the lights', 'Dim the lights']
//   };
// });
voiceService.registerCommand('Mentor rahul', 'rahul_on', async (command) => {
  // Here you can add your own logic, e.g., call an API, update UI, etc.
  return {
    text: 'I did not know that your project mentor rahul have a girlfriend , whos name starts with letter A',
    suggestions: ['Turn off the lights', 'Dim the lights']
  };
});