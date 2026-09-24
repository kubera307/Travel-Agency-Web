import React from 'react';
import { ShieldCheck, Compass, CheckCircle2, Award, Headphones, RotateCcw, HeartHandshake, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    title: '100% Verified Local Guides',
    desc: 'Born and raised in the regions you visit. Certified in wilderness first aid and local folklore.',
    icon: Award
  },
  {
    title: 'Transparent All-Inclusive Pricing',
    desc: 'Zero hidden permits, vehicle tolls, or unexpected surcharges. What you see is what you pay.',
    icon: CheckCircle2
  },
  {
    title: 'Handpicked Boutique Stays',
    desc: 'Heritage havelis, luxury glamping domes, tea-estate bungalows, and vetted eco-lodges.',
    icon: Sparkles
  },
  {
    title: '24/7 Dedicated Trip Concierge',
    desc: 'A real human coordinator available instantly via WhatsApp or phone throughout your journey.',
    icon: Headphones
  },
  {
    title: 'Flexible Rescheduling',
    desc: 'Change departure dates or transfer your booking up to 14 days before departure with no penalty.',
    icon: RotateCcw
  },
  {
    title: 'Mindful & Sustainable Footprint',
    desc: 'We partner directly with village artisans and adhere to strict Leave-No-Trace wilderness codes.',
    icon: HeartHandshake
  }
];

export default function WhyTravelIndia() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-t border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Floating Proof Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80"
                alt="NammaYatra expedition leader with travelers in front of historic architecture"
                className="w-full h-[520px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Bottom tag inside image */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest">
                  Authentic Experiences
                </p>
                <h4 className="text-xl font-bold font-display mt-1">
                  Taj Mahal, Agra & Beyond
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Private sunrise access with ASI certified historians.
                </p>
              </div>
            </div>

            {/* Floating Proof Card 1: 10,000+ Travelers */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 z-10 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-900 font-display">10,000+</p>
                <p className="text-xs text-slate-500 font-medium">Mindful explorers hosted since 2019</p>
              </div>
            </div>

            {/* Floating Proof Card 2: 4.9 Rating */}
            <div className="hidden sm:flex absolute -top-4 -left-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg border border-slate-100 items-center gap-2.5 z-10">
              <div className="flex text-amber-400">
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">4.9 / 5.0 Rating</p>
                <p className="text-[10px] text-slate-500 font-medium">Across Google & TripAdvisor</p>
              </div>
            </div>
          </div>

          {/* Right Column: 6 Features */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-600 mb-2.5">
                THE NammaYatra PROMISE
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
                Travel with confidence
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                We obsess over every detail so you can immerse yourself completely in India's wonders without logistical worries or unpleasant surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-display">
                        {f.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

