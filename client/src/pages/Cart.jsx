import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { resources } from '../assets/resources';
import { motion, AnimatePresence } from 'framer-motion';
import BlurCircle from '../components/BlurCircle';
import { ShoppingCart, Loader2, BookOpen, ArrowRight, X, CheckCircle } from 'lucide-react';

const Cart = () => {
  const { isSignedIn, user } = useUser();
  const [enrolledResources, setEnrolledResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = "https://career-ai-mern.onrender.com";

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        toast.error('You must be logged in to view your cart.');
        navigate('/');
        return;
      }

      try {
        const res = await fetch(`${url}/api/enrolled`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: user?.primaryEmailAddress?.emailAddress,
          }),
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data.resourceIds)) {
          const enrolled = resources.filter((res) =>
            data.resourceIds.includes(res.resourceId)
          );
          setEnrolledResources(enrolled);
        } else {
          toast.error('Failed to load enrolled courses.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isSignedIn, user, navigate]);

  const handleRemove = async (resourceId) => {
    const userEmail = user.primaryEmailAddress.emailAddress;

    try {
      const res = await fetch(`${url}/api/course-toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, resourceId, addedToCart: false })
      });

      if (res.ok) {
        setEnrolledResources(prev => prev.filter(item => item.resourceId !== resourceId));
        toast.success('Removed from cart');
      } else {
        toast.error('Failed to remove course.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    }
  };

  const calculateTotal = () => {
    return enrolledResources.reduce((sum, item) => {
      const numericPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return sum + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white text-center py-20 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-lg font-medium">Loading your learning journey...</p>
      </div>
    );
  }

  return (
    <section className="relative pt-16 md:pt-50 pb-24 bg-gradient-to-br from-gray-900 to-gray-950 px-4 sm:px-6 min-h-screen text-white overflow-hidden">
      <BlurCircle top="-100px" left="-100px" color="purple" size="lg" />
      <BlurCircle bottom="-100px" right="-100px" color="blue" size="lg" />
      
     

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
        >
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 mr-4">
                <ShoppingCart className="text-primary" size={28} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">
                Your Learning Cart
              </h1>
            </div>
            <p className="text-gray-400 ml-16">Review and manage your selected courses</p>
          </div>
          {enrolledResources.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-white">{enrolledResources.length}</span> course{enrolledResources.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}
        </motion.div>

        {enrolledResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800 backdrop-blur-sm max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center p-5 rounded-full bg-gray-800/50 border border-gray-700 mb-6">
              <BookOpen className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-medium mb-3">Your learning cart is empty</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
              Explore our premium courses to start your learning journey today.
            </p>
            <button
              onClick={() => {navigate('/resources'); scrollTo(0, 0)}}
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 rounded-xl text-white font-medium flex items-center mx-auto transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Browse All Courses
              <ArrowRight className="ml-2" size={18} />
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-5 border-b border-gray-800">
                  <h2 className="text-xl font-semibold flex items-center">
                    <CheckCircle className="text-emerald-400 mr-2" size={20} />
                    Selected Courses
                  </h2>
                </div>
                <div className="divide-y divide-gray-800/50">
                  <AnimatePresence>
                    {enrolledResources.map((resource) => (
                      <motion.div
                        key={resource.resourceId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 hover:bg-gray-800/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row gap-5">
                          <div className="flex-shrink-0 w-full sm:w-40 h-32 rounded-lg overflow-hidden">
                            <img
                              src={resource.image}
                              alt={resource.name}
                              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                              onError={(e) => {
                                e.target.src = '/course-fallback.jpg';
                                e.target.className = 'w-full h-full object-contain bg-gray-800 p-4';
                              }}
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{resource.name}</h3>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
                              </div>
                              <button
                                onClick={() => handleRemove(resource.resourceId)}
                                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                aria-label="Remove course"
                              >
                                <X size={18} />
                              </button>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-lg font-bold text-primary">{resource.price}</span>
                              <span className="text-sm text-gray-400">Lifetime access</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm sticky top-6"
              >
                <h3 className="text-xl font-semibold mb-6 pb-4 border-b border-gray-800 flex items-center">
                  <ShoppingCart className="mr-3 text-primary" size={22} />
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-emerald-400">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg pt-4 border-t border-gray-800">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/cart/payment', { state: { totalAmount: calculateTotal() } })}
                  className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white rounded-xl text-lg font-semibold flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  Secure Checkout
                  <ArrowRight className="ml-2" size={20} />
                </button>

                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="ml-3 text-sm text-gray-400">
                      Secure payment processing. Your information is encrypted and protected.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;