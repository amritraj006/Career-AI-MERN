import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { Lock, CreditCard, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Payment = () => {
  const { user } = useUser();
  const { state } = useLocation();
  const totalAmount = state?.totalAmount || 0;
  const resourceId = state?.resourceId;
  const courseName = state?.courseName;

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [agree, setAgree] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCard, setActiveCard] = useState('visa');
  const [showConfirm, setShowConfirm] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

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
          totalAmount: totalAmount,
          resourceId: resourceId,
          courseName: courseName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment processing failed');

      toast.success('Payment successful! Redirecting...', {
        style: { background: '#16a34a', color: 'white' },
        duration: 1000,
      });
      setTimeout(() => navigate('/my-dashboard'), 1000);
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

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-6 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Secure Payment
          </h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 slide-up">
        {/* Payment Content */}
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <CreditCard className="text-primary" size={24} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Complete Your Payment
            </h2>
            <p className="text-gray-600">Enter your card details to proceed</p>
            
            <div className="inline-block mt-6 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="text-center text-lg font-medium">
                Total Amount: <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Credit Card Preview */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 shadow-xl shadow-indigo-900/10 overflow-hidden text-white">
            {/* Card background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-indigo-400/20 blur-xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="text-xl font-bold tracking-wider">Credit Card</div>
                <div className="flex space-x-2">
                  {activeCard === 'visa' && (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                      alt="Visa" 
                      className="h-6 object-contain"
                    />
                  )}
                  {activeCard === 'mastercard' && (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                      alt="Mastercard" 
                      className="h-6 object-contain"
                    />
                  )}
                  {activeCard === 'amex' && (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/American_Express_logo.svg/1200px-American_Express_logo.svg.png" 
                      alt="American Express" 
                      className="h-6 object-contain"
                    />
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-sm text-indigo-100 mb-2">Card Number</div>
                <div className="text-2xl font-mono tracking-wider font-medium">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-indigo-100 mb-2">Card Holder</div>
                  <div className="text-lg font-medium uppercase tracking-wider">{cardName || 'YOUR NAME'}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-100 mb-2">Expires</div>
                  <div className="text-lg font-medium">{expiry || '••/••'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-4">
              <Shield className="text-primary" size={20} />
              <span>Payment Details</span>
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 font-mono tracking-wider transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">CVV</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 transition-all shadow-sm"
                    />
                    <Lock className="absolute right-3 top-3.5 text-gray-400" size={16} />
                  </div>
                </div>
              </div>

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary transition-colors cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the <a href="#" className="text-primary hover:text-primary-dull hover:underline transition-colors">Terms and Conditions</a> and authorize this payment
                </label>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full mt-8 py-4 px-6 rounded-xl text-lg font-bold shadow-md transition-all flex items-center justify-center gap-3 ${
                isProcessing 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-primary hover:bg-primary-dull text-white hover:shadow-lg hover:-translate-y-0.5'
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
            </button>

            <div className="mt-6 flex items-center justify-center text-xs text-gray-500 font-medium gap-1.5">
              <Shield className="h-4 w-4" />
              <span>256-bit SSL secured payment</span>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md shadow-2xl slide-up">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6 border border-red-100">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Confirm Payment</h3>
              <p className="text-gray-600 mb-8 text-lg">
                You are about to charge <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span> to your card. This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-bold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAndPay}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dull text-white transition-colors font-bold shadow-md"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;