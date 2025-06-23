"use client";
// src/App.tsx
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ConnectWallet } from '@/components/ConnectWallet';
import { IssueCertificate } from '@/components/IssueCertificate';
import { VerifyCertificate } from '@/components/VerifyCertificate';
import { CertificateSuccess } from '@/components/CertificateSuccess';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [issuedCertId, setIssuedCertId] = useState<string>('');

  const handleLogout = () => {
    setUser(null);
    setIssuedCertId('');
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10">
        {!user ? (
          <ConnectWallet setUser={setUser} />
        ) : (
          <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-between items-center mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Certificate DApp</h1>
                  <p className="text-purple-200">Welcome back, {formatAddress(user.profile?.stxAddress?.testnet)}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-lg border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </motion.div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto space-y-8">
              <IssueCertificate user={user} onCertificateIssued={setIssuedCertId} />

              {issuedCertId && (
                <CertificateSuccess certId={issuedCertId} />
              )}

              <VerifyCertificate />
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default App;