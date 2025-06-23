"use client";
//components/IssueCertificate.tsx
import React, { useState } from 'react';
import { standardPrincipalCV, stringUtf8CV, uintCV } from '@stacks/transactions';
import { NETWORK } from '@/lib/contract';
import { Award, User, Building, Calendar, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Add type declarations for wallet providers
declare global {
    interface Window {
        // StacksProvider is already defined in @stacks/connect
        HiroWalletProvider?: any;
        XverseProviders?: any;
    }
}

interface IssueCertificateProps {
    user: any;
    onCertificateIssued: (certId: string) => void;
}

export const IssueCertificate: React.FC<IssueCertificateProps> = ({ user, onCertificateIssued }) => {
    const [formData, setFormData] = useState({
        studentAddress: '',
        courseName: '',
        organization: '',
        validityDays: '365'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const validateForm = (): boolean => {
        const errors: string[] = [];

        // Validate course name
        if (!formData.courseName?.trim()) {
            errors.push('Course name is required');
        } else if (formData.courseName.trim().length > 100) {
            errors.push('Course name must be less than 100 characters');
        }

        // Validate organization
        if (!formData.organization?.trim()) {
            errors.push('Organization is required');
        } else if (formData.organization.trim().length > 100) {
            errors.push('Organization must be less than 100 characters');
        }

        // Validate validity days
        const validityDays = parseInt(formData.validityDays);
        if (!formData.validityDays?.trim() || isNaN(validityDays) || validityDays <= 0) {
            errors.push('Please enter a valid number of days (greater than 0)');
        } else if (validityDays > 10000) {
            errors.push('Validity days cannot exceed 10,000');
        }

        // Show first error if any
        if (errors.length > 0) {
            toast.error(errors[0]);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ensure stacks/connect only runs in client
        const { AppConfig, openContractCall, UserSession } = await import('@stacks/connect');

        const appConfig = new AppConfig(["store_write"]);
        const userSession = new UserSession({ appConfig });
        console.log('=== Form Submit Started ===');
        console.log('Form data:', formData);
        console.log('User object:', user);

        // Validate form first
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        // Check wallet connection
        if (!user) {
            toast.error('Please connect your wallet first');
            console.error('User not connected');
            return;
        }

        // Additional user checks
        if (!user.profile) {
            toast.error('Wallet connection incomplete. Please reconnect your wallet.');
            console.error('User profile missing:', user);
            return;
        }

        setIsLoading(true);

        try {
            console.log('=== Preparing Contract Call ===');

            // Prepare function arguments
            const studentAddress = formData.studentAddress.trim();
            const courseName = formData.courseName.trim();
            const organization = formData.organization.trim();
            const validityDays = parseInt(formData.validityDays);

            console.log('Processing address:', studentAddress);
            console.log('Course name:', courseName);
            console.log('Organization:', organization);
            console.log('Validity days:', validityDays);

            // Fixed contract details - using the correct contract ID
            const contractAddress = 'ST34H017VX32RKDE9QG5Z3F1AC54KFMMJQ7QMS5H4';
            const contractName = 'cert-dapp';

            console.log('Using contract address:', contractAddress);
            console.log('Using contract name:', contractName);

            const functionArgs = [
                standardPrincipalCV(studentAddress),
                stringUtf8CV(courseName),
                stringUtf8CV(organization),
                uintCV(validityDays),
            ];

            console.log('Function args prepared successfully:', functionArgs);

            const contractCallOptions = {
                contractAddress: contractAddress,
                contractName: contractName,
                functionName: 'issue-certificate',
                functionArgs,
                network: NETWORK,
                appDetails: {
                    name: 'Certificate DApp',
                    icon: 'https://cryptologos.cc/logos/stacks-stx-logo.png',
                },
                userSession,
                onFinish: (data: any) => {
                    console.log('=== Transaction Finished Successfully ===');
                    console.log('Transaction data:', data);

                    // Show success message
                    toast.success('Certificate issued successfully! Transaction submitted to blockchain.');

                    // Extract transaction ID
                    const txId = data.txId || data.transactionId || data.tx || 'unknown';
                    console.log('Transaction ID:', txId);

                    // Notify parent component
                    onCertificateIssued(txId);

                    // Reset form
                    setFormData({
                        studentAddress: '',
                        courseName: '',
                        organization: '',
                        validityDays: '365',
                    });

                    setIsLoading(false);
                },
                onCancel: () => {
                    console.log('=== Transaction Cancelled by User ===');
                    toast.error('Transaction was cancelled');
                    setIsLoading(false);
                },
            };

            console.log('=== Opening Contract Call ===');
            console.log('Contract call options:', contractCallOptions);
            console.log('About to call openContractCall...');

            // Add a small delay to ensure UI state is properly set
            await new Promise(resolve => setTimeout(resolve, 100));

            // This should trigger the wallet popup
            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Wallet did not respond in time')), 10000)
            );

            await Promise.race([
                openContractCall({
                    ...contractCallOptions
                }),
                timeout,
            ]);


            console.log('openContractCall executed - wallet should open now');

        } catch (error: any) {
            console.error('=== Contract Call Error ===');
            console.error('Error details:', error);
            console.error('Error message:', error?.message);
            console.error('Error stack:', error?.stack);

            setIsLoading(false);

            // Handle specific error types
            let errorMessage = 'Failed to issue certificate';

            if (error?.message) {
                if (error.message.includes('User denied')) {
                    errorMessage = 'Transaction was cancelled by user';
                } else if (error.message.includes('checksum mismatch')) {
                    errorMessage = 'Invalid Stacks address format. Please check the address and try again.';
                } else if (error.message.includes('wallet')) {
                    errorMessage = 'Wallet error. Please make sure your wallet is installed and connected.';
                } else if (error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                } else if (error.message.includes('contract')) {
                    errorMessage = 'Smart contract error. Please verify contract details.';
                } else if (error.message.includes('principal')) {
                    errorMessage = 'Invalid address format. Please enter a valid Stacks address.';
                } else {
                    errorMessage = `Error: ${error.message}`;
                }
            }

            toast.error(errorMessage);
        }

        console.log('=== Form Submit Finished ===');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
            <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
                    <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Issue Certificate</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <label className="flex items-center text-purple-200 text-sm font-medium mb-3">
                            <User className="w-4 h-4 mr-2" />
                            Student Address
                        </label>
                        <input
                            type="text"
                            value={formData.studentAddress}
                            onChange={(e) => handleInputChange('studentAddress', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                            required
                        />
                        <p className="text-xs text-purple-300 mt-1">
                            Enter a valid Stacks address (starts with ST for testnet, SP for mainnet)
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <label className="flex items-center text-purple-200 text-sm font-medium mb-3">
                            <Award className="w-4 h-4 mr-2" />
                            Course Name
                        </label>
                        <input
                            type="text"
                            value={formData.courseName}
                            onChange={(e) => handleInputChange('courseName', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., B.Tech Computer Science"
                            maxLength={100}
                            required
                        />
                        <p className="text-xs text-purple-300 mt-1">
                            Maximum 100 characters
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <label className="flex items-center text-purple-200 text-sm font-medium mb-3">
                            <Building className="w-4 h-4 mr-2" />
                            Organization
                        </label>
                        <input
                            type="text"
                            value={formData.organization}
                            onChange={(e) => handleInputChange('organization', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="e.g., NIT Rourkela"
                            maxLength={100}
                            required
                        />
                        <p className="text-xs text-purple-300 mt-1">
                            Maximum 100 characters
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label className="flex items-center text-purple-200 text-sm font-medium mb-3">
                            <Calendar className="w-4 h-4 mr-2" />
                            Validity (Days)
                        </label>
                        <input
                            type="number"
                            value={formData.validityDays}
                            onChange={(e) => handleInputChange('validityDays', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="365"
                            min="1"
                            max="10000"
                            required
                        />
                        <p className="text-xs text-purple-300 mt-1">
                            Between 1 and 10,000 days
                        </p>
                    </motion.div>
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !user}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span>Opening Wallet...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            <span>
                                {!user ? 'Connect Wallet First' : 'Issue Certificate'}
                            </span>
                        </>
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
};