import React from 'react';
import { Printer, Download, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, User, Phone, Car } from 'lucide-react';

export default function BookingTicketPass({ ticket }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto my-6">
      {/* Action Bar (Not visible during print) */}
      <div className="no-print flex items-center justify-between mb-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5" />
          <span>Confirmed Travel Pass &amp; Receipt</span>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#0B192C] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Ticket Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-800/80 shadow-2xl overflow-hidden print:border-black print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-[#0B192C] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-2xl shadow-md">
              🛺
            </div>
            <div>
              <div className="font-display font-black text-2xl tracking-tight flex items-center gap-1.5">
                <span>TRAVEL</span>
                <span className="text-orange-400">INDIA</span>
              </div>
              <p className="text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
                Official Tourist Boarding Pass &amp; Tax Invoice
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Booking Reference</p>
            <p className="font-mono font-black text-xl text-amber-400">{ticket.ticketNumber || ticket.bookingId}</p>
            <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              ● 100% PAID TO SARATHI
            </span>
          </div>
        </div>

        {/* Tour Title & Route */}
        <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Confirmed Tour Package
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 mt-0.5">
                {ticket.tour?.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">{ticket.tour?.tagline}</p>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
              <p className="font-bold text-slate-900 text-sm">{ticket.tour?.duration}</p>
            </div>
          </div>
        </div>

        {/* Schedule & Pickup Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>Departure Date</span>
            </div>
            <p className="font-display font-black text-base text-slate-900">
              {ticket.schedule?.departureDate}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Report 15 mins prior</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Doorstep Pickup</span>
            </div>
            <p className="font-bold text-sm text-slate-900 line-clamp-2">
              {ticket.schedule?.pickupPoint}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Language: {ticket.schedule?.guideLanguage}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase mb-1">
              <Car className="w-4 h-4 text-orange-500" />
              <span>Vehicle Assigned</span>
            </div>
            <p className="font-bold text-sm text-slate-900">{ticket.tour?.vehicleType}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">✓ Sanitized &amp; GPS Linked</p>
          </div>
        </div>

        {/* Sarathi Chauffeur Information */}
        {ticket.driver && (
          <div className="p-6 sm:p-8 bg-amber-50/60 border-b border-amber-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center text-xl font-bold">
                  🛺
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{ticket.driver.name}</h4>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ★ {ticket.driver.rating || '4.95'} Sarathi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Vehicle: <span className="font-semibold text-slate-900">{ticket.driver.vehicle}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-xl border border-amber-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono font-bold text-slate-900">{ticket.driver.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Travellers List */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Registered Travellers ({ticket.travellers?.length || 1})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ticket.travellers?.map((trv, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span>
                    {idx + 1}. {trv.full_name}
                  </span>
                  <span className="text-slate-400 font-normal">({trv.gender || 'Adult'})</span>
                </div>
                {trv.phone && <p className="text-slate-500 mt-0.5">Contact: {trv.phone}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Verification Code */}
        <div className="p-6 sm:p-8 bg-slate-900 text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Package Total:</span>
              <span className="font-bold text-white">₹{ticket.pricing?.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {ticket.pricing?.discount > 0 && (
              <div className="flex items-center gap-4 text-emerald-400">
                <span>Discount ({ticket.pricing?.couponCode}):</span>
                <span className="font-bold">-₹{ticket.pricing?.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Grand Total Settled:</span>
              <span className="font-display font-black text-xl text-amber-400">
                ₹{ticket.pricing?.grandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* QR Verification Mock Badge */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="w-16 h-16 bg-white rounded-xl p-1 flex items-center justify-center text-3xl">
              📱
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Security Pass Hash</p>
              <p className="font-mono text-xs font-bold text-amber-400">{ticket.verificationCode || 'TI-VERIFIED-PASS'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">✓ ONDC Protocol Certified</p>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-slate-950 text-slate-500 text-[11px] p-4 text-center border-t border-slate-800 flex flex-wrap items-center justify-center gap-4">
          <span>24x7 Tourist Helpline: 1800-BHARAT</span>
          <span>•</span>
          <span>Zero Commission Policy Guarantee</span>
          <span>•</span>
          <span>Emergency SOS: +91 98765 43210</span>
        </div>
      </div>
    </div>
  );
}

