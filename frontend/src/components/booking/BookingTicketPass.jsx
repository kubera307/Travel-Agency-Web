import React from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Car,
  Sparkles,
  QrCode
} from 'lucide-react';

export default function BookingTicketPass({ ticket }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto my-6 text-left">
      {/* Action Bar (Not visible during print) */}
      <div className="no-print flex items-center justify-between mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#1D1B18]/10 shadow-sm">
        <div className="flex items-center gap-2.5 text-emerald-800 font-medium text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ONDC Verified Boarding Pass &amp; Tax Invoice</span>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-[#B99762]" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Ticket Card */}
      <div className="bg-white rounded-3xl border border-[#1D1B18]/15 shadow-xl overflow-hidden print:border print:border-black print:shadow-none">
        {/* Ticket Header */}
        <div className="bg-[#12141A] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#B68D40]/40 relative overflow-hidden">
          {/* Subtle gold gradient accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B68D40]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#B68D40]/20 border border-[#B68D40]/40 flex items-center justify-center text-[#B68D40] text-xl font-serif">
              ✦
            </div>
            <div>
              <div className="font-serif text-2xl tracking-wide flex items-center gap-2 text-[#FAF8F5]">
                <span>BHARAT</span>
                <span className="text-[#B68D40] font-light">YATRA</span>
              </div>
              <p className="text-[10px] text-[#B68D40] uppercase tracking-[0.2em] font-medium mt-0.5">
                Official Tourist Boarding Pass &amp; Tax Invoice
              </p>
            </div>
          </div>

          <div className="sm:text-right relative z-10">
            <p className="text-[10px] text-[#FAF8F5]/50 uppercase tracking-widest font-mono">
              Booking Reference
            </p>
            <p className="font-mono text-xl text-[#B68D40] font-semibold mt-0.5">
              {ticket.ticketNumber || ticket.bookingId}
            </p>
            <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ● 100% DIRECT DRIVER SETTLED
            </span>
          </div>
        </div>

        {/* Tour Title & Route */}
        <div className="p-6 sm:p-8 border-b border-[#1D1B18]/10 bg-[#FAF8F5]/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em]">
                Confirmed Itinerary
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B18] mt-1 font-normal tracking-tight">
                {ticket.tour?.title}
              </h2>
              {ticket.tour?.tagline && (
                <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
                  {ticket.tour.tagline}
                </p>
              )}
            </div>

            {ticket.tour?.duration && (
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#1D1B18]/10 shadow-xs text-center">
                <p className="text-[10px] text-[#1D1B18]/50 font-bold uppercase tracking-wider">Duration</p>
                <p className="font-serif text-sm font-semibold text-[#1D1B18]">{ticket.tour.duration}</p>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Pickup Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 border-b border-[#1D1B18]/10">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1B18]/60 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#B99762]" />
              <span>Departure Date</span>
            </div>
            <p className="font-serif text-lg text-[#1D1B18] font-normal">
              {ticket.schedule?.departureDate}
            </p>
            <p className="text-[11px] text-[#1D1B18]/50 font-light mt-0.5">Please report 15 mins prior</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1B18]/60 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#B99762]" />
              <span>Doorstep Pickup</span>
            </div>
            <p className="text-xs font-medium text-[#1D1B18] line-clamp-2">
              {ticket.schedule?.pickupPoint || 'Designated Hotel / Center'}
            </p>
            {ticket.schedule?.guideLanguage && (
              <p className="text-[11px] text-[#1D1B18]/50 font-light mt-0.5">Language: {ticket.schedule.guideLanguage}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1B18]/60 uppercase tracking-wider mb-1">
              <Car className="w-3.5 h-3.5 text-[#B99762]" />
              <span>Assigned Vehicle</span>
            </div>
            <p className="text-xs font-medium text-[#1D1B18]">
              {ticket.tour?.vehicleType || 'Dedicated AC Chauffeur Sedan'}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">✓ Sanitized &amp; GPS Linked</p>
          </div>
        </div>

        {/* Sarathi Chauffeur Information */}
        {ticket.driver && (
          <div className="p-6 sm:p-8 bg-[#FAF8F5] border-b border-[#1D1B18]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1D1B18] text-[#B99762] flex items-center justify-center text-lg font-serif border border-[#B99762]/30">
                  ✦
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-base text-[#1D1B18] font-normal">{ticket.driver.name}</h4>
                    <span className="bg-[#B68D40]/15 text-[#B68D40] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#B68D40]/25">
                      ★ {ticket.driver.rating || '4.95'} Sarathi
                    </span>
                  </div>
                  <p className="text-xs text-[#1D1B18]/70 mt-0.5 font-light">
                    Vehicle: <span className="font-mono font-medium text-[#1D1B18]">{ticket.driver.vehicle}</span>
                  </p>
                </div>
              </div>

              <div className="bg-white px-4 py-2 rounded-full border border-[#1D1B18]/10 flex items-center gap-2 shadow-xs self-start sm:self-auto">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-mono font-medium text-[#1D1B18]">{ticket.driver.phone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Travellers List */}
        <div className="p-6 sm:p-8 border-b border-[#1D1B18]/10">
          <h4 className="text-[11px] font-bold text-[#1D1B18]/60 uppercase tracking-[0.2em] mb-4">
            Registered Travelers ({ticket.travellers?.length || 1})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ticket.travellers?.map((trv, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#1D1B18]/10 text-xs">
                <div className="font-medium text-[#1D1B18] flex items-center gap-2">
                  <span>
                    {idx + 1}. {trv.full_name}
                  </span>
                  <span className="text-[#1D1B18]/40 font-light">({trv.gender || 'Adult'})</span>
                </div>
                {trv.phone && <p className="text-[#1D1B18]/60 text-[11px] mt-0.5 font-light">Mobile: {trv.phone}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown & Digital Verification Code */}
        <div className="p-6 sm:p-8 bg-[#12141A] text-[#FAF8F5]/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-xs w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-6">
              <span className="text-[#FAF8F5]/50">Expedition Subtotal:</span>
              <span className="font-medium text-white">₹{ticket.pricing?.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {ticket.pricing?.discount > 0 && (
              <div className="flex items-center justify-between sm:justify-start gap-6 text-emerald-400">
                <span>Promotional Privilege ({ticket.pricing?.couponCode}):</span>
                <span className="font-medium">-₹{ticket.pricing?.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex items-center justify-between sm:justify-start gap-6 pt-2 border-t border-white/10 text-sm">
              <span className="text-white font-medium">Grand Total Settled:</span>
              <span className="font-serif text-2xl text-[#B68D40] font-normal">
                ₹{ticket.pricing?.grandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
            {ticket.payment?.transactionId && (
              <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#FAF8F5]/50">ONDC Settlement Ref:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{ticket.payment.transactionId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FAF8F5]/50">Method:</span>
                  <span className="text-white uppercase font-medium">{ticket.payment.paymentMethod}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-emerald-400 font-medium">● 100% Direct Driver Transfer</span>
                </div>
              </div>
            )}
          </div>

          {/* QR Verification Mock Badge */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-full sm:w-auto">
            <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center text-[#1D1B18] shrink-0">
              <QrCode className="w-10 h-10 text-[#1D1B18]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#FAF8F5]/50 uppercase tracking-wider font-mono">Security Pass Hash</p>
              <p className="font-mono text-xs font-semibold text-[#B68D40]">{ticket.verificationCode || 'TI-VERIFIED-PASS'}</p>
              <p className="text-[10px] text-emerald-400 font-medium mt-0.5">✓ ONDC Protocol Certified</p>
            </div>
          </div>
        </div>

        {/* Footer Support */}
        <div className="bg-[#0E131F] text-[#FAF8F5]/50 text-[11px] p-4 text-center border-t border-white/10 flex flex-wrap items-center justify-center gap-4 font-light">
          <span>24x7 Concierge Helpline: 1800-BHARAT</span>
          <span>•</span>
          <span>ONDC Zero-Commission Guarantee</span>
          <span>•</span>
          <span>Emergency Sarathi Dispatch: +91 98765 43210</span>
        </div>
      </div>
    </div>
  );
}
