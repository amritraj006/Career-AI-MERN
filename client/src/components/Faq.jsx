import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How accurate are your career recommendations?",
      answer: "Our AI system achieves 93% accuracy based on user feedback and career outcomes. We continuously update our algorithms with the latest market data to ensure relevant suggestions."
    },
    {
      question: "Can I retake the career assessment?",
      answer: "Yes, you can retake the assessment anytime. We recommend waiting at least 3 months between assessments to see meaningful changes in your results."
    },
    {
      question: "Do you partner with educational institutions?",
      answer: "We collaborate with over 50 universities and coding bootcamps worldwide to provide seamless education pathways for our recommended careers."
    },
    {
      question: "How often is your career data updated?",
      answer: "We update our career database monthly with the latest salary figures, job growth statistics, and skill requirements from trusted industry sources."
    },
    {
      question: "Is my personal data secure?",
      answer: "Absolutely. We use bank-grade encryption and never share your personal information without your consent. You can delete your data anytime."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white text-gray-900">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-gray-600">
            Everything you need to know about CareerPath AI
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-gray-300 transition-colors"
            >
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none transition-colors duration-200"
              >
                <span className="font-medium text-lg text-gray-800">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
