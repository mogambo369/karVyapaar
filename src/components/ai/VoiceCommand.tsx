import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { useAddProduct, useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

interface VoiceCommandProps {
  onAddToCart?: (item: { name: string; quantity: number; price?: number }) => void;
}

export const VoiceCommand = ({ onAddToCart }: VoiceCommandProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const [lastResult, setLastResult] = useState<{
    action: string;
    items: Array<{ name: string; quantity: number; unit: string; price?: number }>;
    interpretation: string;
  } | null>(null);

  const { processVoiceCommand, isProcessingVoice } = useAIFeatures();
  const { data: products } = useProducts();
  const addProduct = useAddProduct();

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setLastResult(null);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      setTranscript(result[0].transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone access.");
      } else {
        toast.error("Voice recognition failed. Please try again.");
      }
    };

    recognition.onend = async () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language]);

  const handleProcess = async () => {
    if (!transcript) {
      toast.warning("Please speak a command first");
      return;
    }

    const langCode = language.split("-")[0];
    const result = await processVoiceCommand(transcript, langCode);
    setLastResult(result);

    if (result.action === "CREATE_BILL" && onAddToCart && result.items.length > 0) {
      result.items.forEach(item => {
        // Try to find matching product
        const matchedProduct = products?.find(p => 
          p.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (matchedProduct) {
          onAddToCart({
            name: matchedProduct.name,
            quantity: item.quantity,
            price: matchedProduct.price,
          });
        } else {
          onAddToCart({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          });
        }
      });
      toast.success(`Added ${result.items.length} items to cart`);
      setIsOpen(false);
    } else if (result.action === "ADD_STOCK" && result.items.length > 0) {
      for (const item of result.items) {
        await addProduct.mutateAsync({
          name: item.name,
          barcode: `VOICE-${Date.now()}`,
          category: "Grocery",
          price: item.price || 0,
          cost_price: (item.price || 0) * 0.8,
          stock: item.quantity,
          min_stock: Math.ceil(item.quantity * 0.2),
          unit: item.unit || "piece",
          gst_rate: 18,
          expiry_date: null,
          batch_number: null,
          is_banned: false,
          ban_reason: null,
          ban_source: null,
        });
      }
      toast.success(`Added ${result.items.length} items to inventory`);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTranscript("");
    setLastResult(null);
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-auto flex-col gap-2 p-4"
        onClick={() => setIsOpen(true)}
      >
        <Mic className="h-5 w-5" />
        <div className="text-center">
          <p className="font-medium text-sm">Voice Input</p>
          <p className="text-xs opacity-70">Speak to add items</p>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" />
              Voice Command
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Language Selection */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi-IN">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr-IN">मराठी (Marathi)</SelectItem>
                  <SelectItem value="gu-IN">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="en-IN">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Microphone Button */}
            <div className="flex flex-col items-center gap-4 py-6">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={`h-20 w-20 rounded-full ${isListening ? "animate-pulse" : ""}`}
                onClick={startListening}
                disabled={isProcessingVoice}
              >
                {isListening ? (
                  <MicOff className="h-8 w-8" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening..." : "Tap to speak"}
              </p>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">You said:</p>
                <p className="font-medium">{transcript}</p>
              </div>
            )}

            {/* Processing */}
            {isProcessingVoice && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Processing command...</span>
              </div>
            )}

            {/* Result */}
            {lastResult && (
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Badge>{lastResult.action}</Badge>
                  <span className="text-sm">{lastResult.interpretation}</span>
                </div>
                {lastResult.items.length > 0 && (
                  <div className="space-y-1">
                    {lastResult.items.map((item, i) => (
                      <p key={i} className="text-sm text-muted-foreground">
                        • {item.name}: {item.quantity} {item.unit}
                        {item.price && ` @ ₹${item.price}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            {transcript && !isListening && !isProcessingVoice && (
              <Button className="w-full" onClick={handleProcess}>
                Process Command
              </Button>
            )}

            {/* Examples */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">Examples:</p>
              <p>• "10 kilo cheeni 45 rupaye mein jodo" (Add 10kg sugar at ₹45)</p>
              <p>• "Bill mein 2 packet doodh dalo" (Add 2 packets milk to bill)</p>
              <p>• "Atta ka stock check karo" (Check flour stock)</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
