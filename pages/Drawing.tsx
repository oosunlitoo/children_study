import React, { useRef, useState, useEffect } from 'react';
import { analyzeDrawing } from '../services/geminiService';
import { LoadingState } from '../types';
import { Eraser, RefreshCcw, Send, Trash2 } from 'lucide-react';

const Drawing: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Set white background initially
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath(); // Reset path so lines don't connect
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setFeedback(null);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setStatus('loading');
    const base64 = canvas.toDataURL('image/png');
    const response = await analyzeDrawing(base64);
    setFeedback(response);
    setStatus('success');
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-brand-purple">Art Studio</h1>
            <button 
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="bg-brand-purple text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
                {status === 'loading' ? (
                    <span>Thinking...</span>
                ) : (
                    <>
                        <Send size={18} />
                        <span>AI Check</span>
                    </>
                )}
            </button>
        </div>

        <div className="relative w-full aspect-square bg-white rounded-2xl shadow-xl border-4 border-brand-purple overflow-hidden touch-none">
             <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
            />
            {status === 'loading' && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="animate-bounce text-4xl">🎨</div>
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="w-full mt-6 bg-white p-4 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    {colors.map(c => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={clearCanvas} className="p-2 text-gray-500 hover:text-red-500 bg-gray-100 rounded-full">
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500">Brush Size:</span>
                <input 
                    type="range" 
                    min="2" 
                    max="20" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>

        {/* Feedback Area */}
        {feedback && (
            <div className="mt-6 w-full bg-brand-purple/10 p-6 rounded-3xl border-2 border-brand-purple animate-in slide-in-from-bottom-4">
                <div className="flex gap-4 items-start">
                    <div className="text-4xl">🤖</div>
                    <div>
                        <h3 className="font-bold text-brand-purple mb-1">AI Teacher says:</h3>
                        <p className="text-gray-800 font-medium">{feedback}</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Drawing;
