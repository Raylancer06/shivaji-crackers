import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Users, Package, Award, MapPin, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

export const metadata = {
  title: 'About Us | Sivaji Firecracker',
  description: 'Learn about Sivaji Firecracker - leading direct factory fireworks manufacturer & wholesale distributor serving Hyderabad and Pan-India.',
};

export default function AboutPage() {
  const stats = [
    { number: '1000+', label: 'Happy Families', sub: 'Celebrated Diwali with us' },
    { number: '2500+', label: 'Orders Dispatched', sub: 'Safe heavy lorry parcels' },
    { number: '150+', label: 'Verified Products', sub: 'CSIR-NEERI Green certified' },
    { number: '40+', label: 'Districts Served', sub: 'Daily Hyderabad transport' },
  ];

  const milestones = [
    {
      num: '01',
      title: 'Our Sivakasi Heritage',
      text: 'Sivaji Firecracker is one of the leading Wholesale & Retail crackers shops operating directly from Sivakasi since 2017. We take immense pride in offering a wide assortment of top-quality fireworks that add royal sparkle, joy, and peace of mind to your festivities.',
    },
    {
      num: '02',
      title: 'A Symphony of Joy & Light',
      text: 'Step into a world of celebration with our dazzling assortment of fireworks that turn any occasion into a mesmerizing spectacle. From the enchanting glow of sparklers to the thunderous applause of aerial fancy repeaters, our collection is a crafted symphony of excitement.',
    },
    {
      num: '03',
      title: 'Traditional Craftsmanship Meets Green Science',
      text: 'Light up the skies with our single and multi-sound crackers, each burst echoing with a crisp rhythm that adds a musical note to festivities. Create visual masterpieces with ground chakkars, giant flower pots, and twinkling stars, painting the night with vibrant patterns.',
    },
    {
      num: '04',
      title: 'Shared Festive Memories',
      text: 'Join us in lighting up the night sky with a symphony of colors, sounds, and emotions. Celebrate with Sivaji Firecracker, where every firework tells a story of unity, tradition, and the unforgettable beauty of shared festive moments with family and friends.',
    },
    {
      num: '05',
      title: 'Exquisite Curation & Safe Logistics',
      text: 'At Sivaji Firecracker, we curate an exquisite collection that transcends ordinary retail fireworks. Whether it is a grand Diwali celebration, a festive wedding, or a community celebration in Hyderabad, our fireworks are packaged in heavy waterproof cartons for safe road transit.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#1C1411]">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-[#200306] to-[#3D060B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F0B543_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F0B543]/40 backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F0B543]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#F0B543]">
              Authentic Sivakasi Pyrotechnics Since 2017
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            About Sivaji Firecracker
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
            Direct factory gate fireworks distributor delivering verified CSIR-NEERI green crackers directly to Hyderabad, Telangana & Pan-India homes.
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-10 bg-white border-b border-[#E2D7C5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="text-3xl sm:text-4xl font-black text-[#550C12] mb-1">
                  {s.number}
                </div>
                <div className="text-sm font-bold text-[#1C1411]">
                  {s.label}
                </div>
                <div className="text-xs text-[#66574F] mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage & 5 Pillars Section */}
      <section className="py-16 md:py-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="space-y-12">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D7C5] shadow-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFF8ED] to-[#F2EBE0] border border-[#C98E2A]/30 flex items-center justify-center text-2xl font-black text-[#550C12] shrink-0">
                {m.num}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#1C1411]">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#66574F] leading-relaxed">
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="mt-16 bg-gradient-to-r from-[#550C12] via-[#7B141C] to-[#550C12] rounded-3xl p-8 sm:p-12 text-white text-center shadow-regal relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black">
              Ready for Your Festival Celebration?
            </h3>
            <p className="text-xs sm:text-sm text-gray-200">
              Browse our updated wholesale price list with 150+ varieties and save up to 80% with direct factory delivery to Hyderabad.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="/estimate"
                className="px-6 py-3 rounded-xl bg-[#F0B543] text-[#1C1411] font-bold text-xs shadow-md hover:bg-[#F8D279] transition-all flex items-center gap-2"
              >
                <span>Open Price List</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#F0B543]" />
                <span>Contact Customer Care</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
