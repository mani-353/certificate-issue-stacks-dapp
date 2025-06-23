"use client";
//components/ConnectWallet.tsx
import React from 'react';
import { showConnect } from '@stacks/connect';
import { Wallet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ConnectWalletProps {
    setUser: (user: any) => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ setUser }) => {
    const connectWallet = () => {
        showConnect({
            appDetails: {
                name: 'Certificate DApp',
                icon: window.location.origin + '/logo192.png',
            },
            onFinish: ({ userSession }) => {
                const userData = userSession.loadUserData();
                setUser(userData);
                toast.success('Wallet connected successfully!', {
                    duration: 3000,
                    style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                    },
                });
            },
            onCancel: () => {
                toast.error('Wallet connection cancelled');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 text-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-8"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-75 animate-pulse-glow"></div>
                        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-full">
                            <Sparkles size={48} className="text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x"
                >
                    Certificate DApp
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    Issue and verify blockchain certificates with the power of Stacks.
                    Connect your wallet to get started on your decentralized certification journey.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={connectWallet}
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 ease-out bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 shadow-2xl hover:shadow-purple-500/25"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <Wallet className="w-6 h-6 mr-3 relative z-10" />
                    <span className="relative z-10">Connect Wallet</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                >
                    {[
                        { icon: "🎓", title: "Issue Certificates", desc: "Create blockchain-verified certificates" },
                        { icon: "🔍", title: "Verify Authenticity", desc: "Instantly verify certificate validity" },
                        { icon: "🔒", title: "Secure & Immutable", desc: "Powered by Stacks blockchain" }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-purple-200">{feature.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div >
    );
};