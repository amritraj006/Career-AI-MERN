import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { Lock, CreditCard, Calendar, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Payment = () => {
  const { user } = useUser();
  const { state } = useLocation();
  const totalAmount = state?.totalAmount || 0;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCard, setActiveCard] = useState('visa');
  const [showConfirm, setShowConfirm] = useState(false);
  const url = "https://career-ai-mern.onrender.com";

  const navigate = useNavigate();

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);

    if (/^4/.test(value)) setActiveCard('visa');
    else if (/^5[1-5]/.test(value)) setActiveCard('mastercard');
    else if (/^3[47]/.test(value)) setActiveCard('amex');
    else setActiveCard('');
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiry(value);
  };

  const isValidCardNumber = (num) => /^\d{4} \d{4} \d{4} \d{4}$/.test(num);
  const isValidExpiry = (date) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split('/').map(Number);
    const now = new Date();
    const currentYear = Number(String(now.getFullYear()).slice(-2));
    const currentMonth = now.getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
  };

  const handlePayment = () => {
    if (!isValidCardNumber(cardNumber)) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    if (!isValidExpiry(expiry)) {
      toast.error('Invalid expiry date (use MM/YY and ensure it\'s in the future)');
      return;
    }
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV (3-4 digits)');
      return;
    }
    if (!agree) {
      toast.error('You must agree to the terms and conditions');
      return;
    }
    setShowConfirm(true);
  };

  const finalizePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${url}/api/course/finalize-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.primaryEmailAddress.emailAddress,
          totalAmount: totalAmount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment processing failed');

      toast.success('Payment successful! Redirecting...', {
        style: { background: '#16a34a', color: 'white' },
        duration: 1000,
      });
      setTimeout(() => navigate('/cart'), 1000);
    } catch (err) {
      toast.error('Payment failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAndPay = () => {
    setShowConfirm(false);
    finalizePayment();
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardFlip = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white overflow-hidden">
      
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50
            }}
            animate={{ 
              opacity: [0, 0.05, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{ 
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 border-b border-gray-800 backdrop-blur-sm py-6 sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <motion.button 
            whileHover={{ x: -3 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent"
          >
            Secure Payment
          </motion.h1>
          
          <div className="w-10"></div>
        </div>
      </motion.header>

      <main className="container mx-auto px-6 py-12">
        {/* Payment Content */}
        <div className="max-w-lg mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-800/50 border border-gray-700 mb-4">
              <CreditCard className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Complete Your Payment
            </h2>
            <p className="text-gray-400">Enter your card details to proceed</p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="inline-block mt-6 px-6 py-3 bg-gray-900/50 border border-gray-700 rounded-xl"
            >
              <div className="text-center text-lg font-medium">
                Total Amount: <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Credit Card Preview */}
          <motion.div
            variants={cardFlip}
            initial="hidden"
            animate="visible"
            className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl shadow-purple-900/30 overflow-hidden"
          >
            {/* Card background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-indigo-400/10 blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="text-xl font-bold text-white">Credit Card</div>
                <div className="flex space-x-2">
                  {activeCard === 'visa' && (
                    <motion.img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                      alt="Visa" 
                      className="h-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                  {activeCard === 'mastercard' && (
                    <motion.img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                      alt="Mastercard" 
                      className="h-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                  {activeCard === 'amex' && (
                    <motion.img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" 
                      alt="American Express" 
                      className="h-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-sm text-indigo-200 mb-2">Card Number</div>
                <div className="text-2xl font-mono tracking-wider font-medium">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-indigo-200 mb-2">Card Holder</div>
                  <div className="text-lg font-medium">{cardName || 'YOUR NAME'}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-200 mb-2">Expires</div>
                  <div className="text-lg font-medium">{expiry || '••/••'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Shield className="text-indigo-400" size={20} />
              <span>Payment Details</span>
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm text-gray-400">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-400">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white font-mono tracking-wider transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm text-gray-400">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm text-gray-400">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-white transition-all"
                    />
                    <Lock className="absolute right-3 top-3.5 text-gray-500" size={16} />
                  </div>
                </div>
              </div>

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 mr-3 h-5 w-5 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-400">
                  I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms and Conditions</a> and authorize this payment
                </label>
              </div>
            </div>

            <motion.button
              onClick={handlePayment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProcessing}
              className={`w-full mt-8 py-4 px-6 rounded-xl text-lg font-semibold transition-all flex items-center justify-center gap-3 ${
                isProcessing 
                  ? 'bg-indigo-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Pay Securely
                </>
              )}
            </motion.button>

            <div className="mt-4 flex items-center justify-center text-xs text-gray-500 gap-1">
              <Shield className="h-3 w-3" />
              <span>256-bit SSL secured payment</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 mb-4">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Payment</h3>
                <p className="text-gray-400 mb-6">
                  You are about to charge <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span> to your card. This action cannot be undone.
                </p>
                
                <div className="flex justify-center gap-4">
                  <motion.button
                    onClick={() => setShowConfirm(false)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmAndPay}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium shadow-md shadow-indigo-500/20"
                  >
                    Confirm Payment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;