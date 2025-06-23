"use client";
// components/VerifyCertificate.tsx
import React, { useState, useEffect } from 'react';
import { fetchCallReadOnlyFunction, uintCV, cvToValue } from '@stacks/transactions';
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK } from '@/lib/contract';
import { Shield, Search, CheckCircle, XCircle, Calendar, User, Award, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Certificate {
    student: string;
    'course-name': string;
    organization: string;
    issuer: string;
    'issued-at': number;
    expiry: number;
}

export const VerifyCertificate: React.FC = () => {
    const [certId, setCertId] = useState('');
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Debug effect to log verification results
    useEffect(() => {
        if (verificationResult) {
            console.log('Updated verification result:', verificationResult);
            console.log('Details structure:', verificationResult.value?.value?.details);
        }
    }, [verificationResult]);

    const verifyCertificate = async () => {
        if (!certId) {
            toast.error('Please enter a certificate ID');
            return;
        }

        setIsLoading(true);

        try {
            const result = await fetchCallReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'verify-certificate',
                functionArgs: [uintCV(parseInt(certId))],
                senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', // placeholder testnet address
                network: NETWORK,
            });

            console.log('Raw verification result:', result);
            setVerificationResult(result);
            if (result.type === 'ok') {
                toast.success('Certificate found successfully!');
            } else {
                toast.error('Certificate not found');
            }
        } catch (error) {
            console.error('Error verifying certificate:', error);
            toast.error('Failed to verify certificate');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (blockHeight: number) => {
        // This is a simplified conversion - in a real app you'd convert block height to actual date
        return `Block #${blockHeight}`;
    };

    // Helper function to safely extract CV values
    // const safeExtractValue = (cv: any, fallback: string = 'N/A') => {
    //     try {
    //         if (!cv) return fallback;
    //         return cvToValue(cv) || fallback;
    //     } catch (error) {
    //         console.warn('Error extracting CV value:', error);
    //         return fallback;
    //     }
    // };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
            <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-2xl mr-4">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Verify Certificate</h2>
            </div>

            <div className="space-y-6">
                <div className="flex space-x-4">
                    <input
                        type="number"
                        value={certId}
                        onChange={(e) => setCertId(e.target.value)}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter certificate ID"
                        min="1"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={verifyCertificate}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Verify</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {verificationResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                    >
                        {verificationResult.type === 'ok' && verificationResult.value && (
                            <div className="space-y-6">
                                {/* Certificate validity status */}
                                <div className={`flex items-center justify-center space-x-3 p-4 rounded-2xl ${verificationResult.value.value.valid.type === "true"
                                    ? 'bg-green-500/20 border border-green-500/30'
                                    : 'bg-red-500/20 border border-red-500/30'
                                    }`}>
                                    {verificationResult.value.value.valid.type === "true" ? (
                                        <>
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                            <span className="text-green-400 font-semibold text-lg">Certificate Valid</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-8 h-8 text-red-400" />
                                            <span className="text-red-400 font-semibold text-lg">Certificate Expired/Invalid</span>
                                        </>
                                    )}
                                </div>

                                {/* Show certificate details if they exist */}
                                {verificationResult.value.value.details?.type === 'some' && verificationResult.value.value.details.value && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <User className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Student</span>
                                            </div>
                                            <p className="text-white font-mono text-sm break-all">
                                                {verificationResult.value.value.details.value.value.student.value}
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <Award className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Course</span>
                                            </div>
                                            <p className="text-white">
                                                {verificationResult.value.value.details.value.value['course-name'].value}
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <Building className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Organization</span>
                                            </div>
                                            <p className="text-white">
                                                {verificationResult.value.value.details.value.value.organization.value}
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Issued At</span>
                                            </div>
                                            <p className="text-white">
                                                {(() => {
                                                    const issuedAt = verificationResult.value.value.details.value.value['issued-at'].value;
                                                    return formatDate(Number(issuedAt));
                                                })()}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <Calendar className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Expires At</span>
                                            </div>
                                            <p className="text-white">
                                                {(() => {
                                                    const expiry = verificationResult.value.value.details.value.value.expiry.value;
                                                    return formatDate(Number(expiry));
                                                })()}
                                            </p>
                                        </div>

                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                            <div className="flex items-center mb-4">
                                                <User className="w-5 h-5 text-purple-400 mr-2" />
                                                <span className="text-purple-200 font-medium">Issuer</span>
                                            </div>
                                            <p className="text-white font-mono text-sm break-all">
                                                {verificationResult.value.value.details.value.value.issuer.value}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Show reason if certificate is invalid and reason exists */}
                                {/* {verificationResult.value.value.valid.type === "false" &&
                                        verificationResult.value.value.reason?.type === 'some' && (
                                            <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                                                <div className="flex items-center mb-2">
                                                    <XCircle className="w-5 h-5 text-red-400 mr-2" />
                                                    <span className="text-red-400 font-medium">Reason</span>
                                                </div>
                                                <p className="text-red-300">
                                                    {verificationResult.value.value.reason?.value}

                                                </p>
                                            </div>
                                        )} */}
                            </div>
                        )}

                        {verificationResult.type === 'error' && (
                            <div className="flex items-center justify-center space-x-3 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
                                <XCircle className="w-8 h-8 text-red-400" />
                                <span className="text-red-400 font-semibold text-lg">Certificate Not Found</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};