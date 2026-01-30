
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, X, QrCode, Zap, Info, ShieldCheck, Search, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { FriendsService } from '../services/friends';

const ScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; friendName?: string } | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const qrCode = new Html5Qrcode("qr-reader");
      setHtml5QrCode(qrCode);

      await qrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
      );

      setScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
    }
  };

  const stopScanner = () => {
    if (html5QrCode) {
      html5QrCode.stop().catch(err => console.error("Error stopping scanner:", err));
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    try {
      // Parse the QR code data
      const data = JSON.parse(decodedText);

      if (data.type === 'ura-card-friend' && data.uniqueId) {
        // Stop scanning temporarily
        stopScanner();

        // Add friend
        const result = await FriendsService.addFriendByUniqueId(data.uniqueId);

        if (result.success) {
          setScanResult({
            success: true,
            message: 'Friend added successfully!',
            friendName: result.friend?.friendName
          });

          // Auto-navigate to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setScanResult({
            success: false,
            message: result.error || 'Failed to add friend'
          });

          // Restart scanning after 3 seconds
          setTimeout(() => {
            setScanResult(null);
            startScanner();
          }, 3000);
        }
      } else {
        setScanResult({
          success: false,
          message: 'Invalid QR code format'
        });

        setTimeout(() => {
          setScanResult(null);
          startScanner();
        }, 2000);
      }
    } catch (err) {
      console.error("Error processing QR code:", err);
      setScanResult({
        success: false,
        message: 'Invalid QR code'
      });

      setTimeout(() => {
        setScanResult(null);
        startScanner();
      }, 2000);
    }
  };

  const onScanFailure = (error: any) => {
    // Ignore scan failures (they happen constantly while scanning)
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const val = (e.target as any).username.value;
    if (val) navigate(`/card/${val}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-amber-500 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full flex-1">
        <div className="p-8 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-4 bg-white/5 rounded-3xl text-white hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>QR Scanner</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black font-outfit text-white mb-3">Connect Instantly</h1>
            <p className="text-slate-500 font-medium">Scan a friend's QR code to connect</p>
          </div>

          <div className="relative w-full max-w-sm aspect-square mb-8">
            <div id="qr-reader" className="w-full h-full rounded-[4rem] overflow-hidden border-4 border-amber-600/30" />

            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-20 h-20 border-t-4 border-l-4 border-amber-600 rounded-tl-[3rem] z-20 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-20 h-20 border-t-4 border-r-4 border-amber-600 rounded-tr-[3rem] z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-20 h-20 border-b-4 border-l-4 border-amber-600 rounded-bl-[3rem] z-20 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-20 h-20 border-b-4 border-r-4 border-amber-600 rounded-br-[3rem] z-20 pointer-events-none" />
          </div>

          {/* Scan Result */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`w-full max-w-md p-6 rounded-3xl ${scanResult.success ? 'bg-emerald-500/10 border-2 border-emerald-500' : 'bg-red-500/10 border-2 border-red-500'}`}
              >
                <div className="flex items-center gap-4">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                  <div className="flex-1">
                    <p className={`font-black text-lg ${scanResult.success ? 'text-emerald-500' : 'text-red-500'}`}>
                      {scanResult.success ? 'Success!' : 'Error'}
                    </p>
                    <p className="text-white text-sm font-medium">
                      {scanResult.message}
                      {scanResult.friendName && ` - ${scanResult.friendName}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!scanResult && (
            <form onSubmit={handleManualSearch} className="mt-12 w-full max-w-md">
              <div className="relative group">
                <input
                  name="username"
                  type="text"
                  placeholder="Or search by username..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] pl-8 pr-20 py-6 text-white font-bold outline-none focus:border-amber-500 transition-all text-lg"
                />
                <button type="submit" className="absolute right-3 top-3 p-4 bg-amber-600 rounded-3xl text-white shadow-xl hover:bg-amber-500 transition-all">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-12 text-center">
          <div className="inline-flex items-center justify-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> Auto-Detect</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
