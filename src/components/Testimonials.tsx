import { Star, MessageSquare, ShieldCheck, Users, ArrowRight } from 'lucide-react';

interface TestimonialsProps {
  onOpenOrder: (planId?: 'lite' | 'basic' | 'prime') => void;
}

export default function Testimonials({ onOpenOrder }: TestimonialsProps) {
  const reviews = [
    {
      id: 1,
      name: 'Reynaldi Aditya',
      handle: '@reynaldi_99',
      plan: 'Basic 4 GB • Xeon v4 2695',
      avatarBg: 'from-blue-500 to-indigo-600',
      comment:
        'Servernya lumayan lancar sih buat mabar 15 orangan. Awalnya sempet bingung cara ganti port sm pasang plugin tp untung dibantuin adminnya via wa sampe kelar. Minusnya pas jam 8 malem ping sempet naik dikit, tp overall aman lah.',
      rating: 4,
      date: '3 hari yang lalu'
    },
    {
      id: 2,
      name: 'Dimas Kurniawan',
      handle: '@dimas_krn',
      plan: 'Basic 8 GB • Xeon v4 2695',
      avatarBg: 'from-emerald-500 to-teal-600',
      comment:
        'Mantap bang, langsung aktif ga nyampe semenit abis tf. Panel pterodactyl nya enteng ga ribet, pasang geyser lgsg jalan temen gua yg di hp android bisa lgsg masuk tanpa delay.',
      rating: 5,
      date: '5 hari yang lalu'
    },
    {
      id: 3,
      name: 'Kevin Pratama',
      handle: '@kevin_pratama',
      plan: 'Lite 4 GB ➔ Prime 8 GB (Xeon Gold)',
      avatarBg: 'from-amber-500 to-orange-600',
      comment:
        'Spek oke sih, cm buat modpack berat kayak ATM 9 saran gua jgn ambil yg 4gb, agak ngos-ngosan pas generate chunk baru. Gua akhirnya upgrade ke prime 8gb baru beneran enteng ga ngelag lagi. CS nya fast respon pas minta upgrade.',
      rating: 3,
      date: '1 minggu yang lalu'
    },
    {
      id: 4,
      name: 'Fauzan Ramadhan',
      handle: '@fauzan_rmd',
      plan: 'Lite 2 GB • Intel Platinum',
      avatarBg: 'from-purple-500 to-pink-600',
      comment:
        'Harga murah bgt pas di kantong pelajar buat main vanilla sama 5 temen tongkrongan. Kemaren sempet salah oprek file server trus minta tolong admin untung ada backup. Mantap dah ga nyesel sewa sini.',
      rating: 5,
      date: '2 minggu yang lalu'
    },
    {
      id: 5,
      name: 'Adrian Saputra',
      handle: '@adrian_s',
      plan: 'Basic 6 GB • Xeon v4 2695',
      avatarBg: 'from-cyan-500 to-blue-600',
      comment:
        'Udah sebulan langganan di sini buat server survival. TPS stabil di 19.8 - 20.0 jarang bgt drop. Paling catatannya tutorial pasang subdomain gratisnya tolong dibikin lebih jelas lagi di panduan ya min.',
      rating: 4,
      date: '3 minggu yang lalu'
    },
    {
      id: 6,
      name: 'Bintang Nugroho',
      handle: '@bintang_nug',
      plan: 'Basic 4 GB • Xeon v4 2695',
      avatarBg: 'from-rose-500 to-red-600',
      comment:
        'Performa servernya oke ga ada lag pas mabar. Tapi respon wa pas tengah malem jam 3 sempet nunggu agak lama sekitar setengah jam, ya wajar sih adminnya jg manusia butuh tidur haha. Pas pagi lgsg beres dibantu setting.',
      rating: 3,
      date: '1 bulan yang lalu'
    }
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 relative bg-gradient-to-b from-[#020b18] via-[#04132a] to-[#020b18] border-t border-[#12345e] overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-cyan-500/[0.05] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[300px] bg-[#4ade80]/[0.035] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062634] border border-[#00d2ff]/30 text-cyan-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span>Ulasan & Testimoni Pemain</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider">Rating 4.6 / 5.0</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Kata Mereka yang Udah <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-[#4ade80]">
              Sewa Server di Sini
            </span>
          </h2>

          <p className="text-[#94a3b8] text-sm sm:text-base max-w-2xl mx-auto">
            Review jujur dari para pemain Minecraft dan server builder yang udah coba langsung performa server MavixStore.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-300 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-amber-400/50 text-amber-400/50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white">4.6 / 5.0 Rata-rata Kepuasan</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
              <span className="text-white">99.9% Uptime Server</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00d2ff]" />
              <span className="text-white">Review Pembeli Asli</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const initialLetter = rev.name.trim().charAt(0).toUpperCase();

            return (
              <div
                key={rev.id}
                className="p-6 sm:p-7 rounded-[28px] bg-[#061833] border border-[#12345e] hover:border-[#00d2ff]/50 hover:shadow-[0_0_30px_rgba(0,210,255,0.15)] transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-4">
                  {/* Header of review: Avatar Initial Letter, name, handle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar with initial letter and colorful background */}
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${rev.avatarBg} p-[1.5px] shadow-md shrink-0`}
                      >
                        <div className="w-full h-full rounded-[14px] flex items-center justify-center font-black text-white text-base select-none">
                          {initialLetter}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm leading-tight">
                          {rev.name}
                        </div>
                        <div className="text-[11px] text-[#94a3b8] font-mono mt-0.5">
                          {rev.handle}
                        </div>
                      </div>
                    </div>

                    {/* Stars (3, 4, or 5) */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-slate-700 text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] font-mono font-bold text-slate-400 ml-1">
                        {rev.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Comment quote (casual, non-formal gaming language) */}
                  <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer info: Plan & date */}
                <div className="pt-3 border-t border-[#12345e] flex items-center justify-between text-[11px]">
                  <span className="text-[#00d2ff] font-mono font-medium">
                    📦 {rev.plan}
                  </span>
                  <span className="text-[#64748b]">
                    {rev.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discord & Community Callout Box */}
        <div className="mt-12 p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-[#061e40] via-[#092b57] to-[#061e40] border border-[#00d2ff]/40 shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a2e5c] text-[#00d2ff] text-xs font-bold uppercase tracking-wider border border-[#00d2ff]/30">
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
              <span>Komunitas Aktif 4.800+ Member</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mau Tanya Pengalaman Member Lain?
            </h3>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-xl">
              Gabung di Discord kami buat ngobrol santai, sharing config plugin, tanya rekomendasi ram, atau mabar bareng anak-anak server lain!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenOrder('basic')}
              className="px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-[#021124] bg-[#00d2ff] hover:bg-[#33dcff] shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Sewa Server Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
