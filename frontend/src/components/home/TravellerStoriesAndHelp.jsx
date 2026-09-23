import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Mail 
} from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Priya Sharma',
    destination: 'Traveled to Kashmir',
    quote: '"An incredible experience! Everything was so well organized. Kashmir was a dream!"',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    name: 'Rahul Menon',
    destination: 'Traveled to Coorg',
    quote: '"The Coorg trip was peaceful and beautiful. Loved the stays and local experiences."',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    name: 'Anita Desai',
    destination: 'Traveled to Rajasthan',
    quote: '"Trekora made our family trip to Rajasthan so special. Great support throughout!"',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  }
];

export default function TravellerStoriesAndHelp() {
  return (
    <section className="py-10 sm:py-14 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Traveller Stories (Cols 1-8) */}
          <div className="lg:col-span-8 text-left">
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 block mb-1">
                  Real People. Real Journeys
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
                  Traveller Stories
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-light">
                  Stories and reviews from our happy travellers.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/about"
                  className="text-xs font-semibold text-slate-700 hover:text-[#B68D40] transition flex items-center gap-1"
                >
                  <span>View All Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="hidden sm:flex items-center gap-1.5 ml-2">
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition"
                    aria-label="Previous story"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition"
                    aria-label="Next story"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {TESTIMONIALS.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex flex-col justify-between text-left"
                >
                  <div>
                    {/* Top Avatar & Stars */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100"
                      />
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-light italic leading-relaxed">
                      {story.quote}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-50 mt-3.5">
                    <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                      {story.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {story.destination}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Need Help Planning? Card (Cols 9-12) */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-xs bg-slate-900 text-white p-6 flex flex-col justify-between text-center min-h-[280px]">
            {/* Background Image: female backpacker looking at mountain horizon */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80"
                alt="Traveller looking at misty mountain horizon"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/40" />
            </div>

            <div className="relative z-10 space-y-1 mt-1">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-white">
                Need Help Planning?
              </h3>
              <p className="text-xs text-white/70 font-light">
                Talk to our travel experts
              </p>
            </div>

            {/* 3 Quick Action Icons (Call, WhatsApp, Email) */}
            <div className="relative z-10 flex items-center justify-center gap-6 my-3.5">
              <a
                href="tel:+919876543210"
                className="flex flex-col items-center gap-1 group text-white/80 hover:text-white"
                title="Call our concierge"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#B68D40] flex items-center justify-center transition">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] tracking-wider uppercase font-medium">Call</span>
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Trekora!%20I%20would%20like%20assistance%20planning%20my%20journey."
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1 group text-white/80 hover:text-white"
                title="WhatsApp our concierge"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#B68D40] flex items-center justify-center transition">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] tracking-wider uppercase font-medium">WhatsApp</span>
              </a>

              <a
                href="mailto:concierge@trekora.in"
                className="flex flex-col items-center gap-1 group text-white/80 hover:text-white"
                title="Email our concierge"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#B68D40] flex items-center justify-center transition">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] tracking-wider uppercase font-medium">Email</span>
              </a>
            </div>

            <div className="relative z-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-1.5 w-full bg-[#B68D40] hover:bg-[#a77f34] text-white py-2 px-4 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
