import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { api } from '../../utils/api';

const DEFAULT_FAQS = [
  {
    question: 'How does booking work?',
    answer:
      'Begin by choosing an established journey or requesting a bespoke custom itinerary. A dedicated destination specialist connects with you within 24 hours to refine dates, dietary preferences, and room arrangements. A 25% deposit secures your private vehicle, certified guides, and heritage room inventory.'
  },
  {
    question: 'Can I customize my itinerary?',
    answer:
      'Yes, entirely. We specialize in bespoke private departures. You may alter daily pacing, add private wildlife game drives, request royal suite upgrades, or extend time in your favorite mountain or backwater sanctuaries.'
  },
  {
    question: 'What is included in a NAMMAYATHRA journey?',
    answer:
      'All boutique luxury accommodations, private climate-controlled transport with certified chauffeurs, all breakfast and select curated regional dinners, monument entrance permits, and private regional historians. There are zero hidden surcharges.'
  },
  {
    question: 'What happens if I need to cancel or reschedule?',
    answer:
      'We offer flexible date transfers up to 21 days before departure with zero penalty fees. In the event of outright cancellation, refunds are honored transparently according to our published tier policy with zero administrative lock-ins.'
  },
  {
    question: 'How are payments handled?',
    answer:
      'We accept secure bank transfers, credit/debit cards via encrypted gateways (Razorpay), and major international wire currencies. Full balance settlements are scheduled 14 days prior to your journey commencement.'
  }
];

export default function FAQSection() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.get('/faqs');
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setFaqs(res.data.slice(0, 6));
        }
      } catch (e) {
        // Fallback
      }
    }
    loadFaqs();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[#EFE4D2]/30 border-t border-[#EFE4D2]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="editorial-eyebrow">
            Clarity & Guidance
          </span>
          <h2 className="editorial-title">
            Frequently Considered Questions
          </h2>
          <p className="editorial-body mx-auto mt-3">
            Essential information regarding bespoke arrangements, sanctuary accommodations, and booking security.
          </p>
        </div>

        {/* Minimal Accordion */}
        <div className="divide-y divide-[#EFE4D2] border-y border-[#EFE4D2] text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5 sm:py-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <h3 className="font-serif text-lg sm:text-xl text-[#1D1B18] group-hover:text-[#B99762] transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6D6A61] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#B99762]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-3 pr-6 animate-in fade-in duration-300">
                    <p className="font-sans text-xs sm:text-sm text-[#6D6A61] leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

