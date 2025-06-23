"use client";
// compoents/CertificateSuccess.tsx
import React from 'react';
import { CheckCircle, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CertificateSuccessProps {
    certId: string;
}

export const CertificateSuccess: React.FC<CertificateSuccessProps> = ({ certId }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(certId);
        toast.success('Certificate ID copied to clipboard!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 shadow-2xl"
        >
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="inline-block mb-6"
                >
                    <div className="bg-green-500 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-white mb-4"
                >
                    Certificate Issued Successfully!
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-green-200 mb-6"
                >
                    Your certificate has been successfully issued on the blockchain.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-white/10 p-4 rounded-2xl border border-white/20 mb-6"
                >
                    <p className="text-sm text-purple-200 mb-2">Certificate ID:</p>
                    <div className="flex items-center justify-between">
                        <code className="text-white font-mono bg-black/30 px-3 py-2 rounded-lg flex-1 mr-3">
                            {certId}
                        </code>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors duration-200"
                        >
                            <Copy className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-sm text-purple-300"
                >
                    Save this Certificate ID to verify the certificate later.
                </motion.p>
            </div>
        </motion.div>
    );
};