import { Cpu, Shield, Zap, RefreshCw, Globe, Database, Terminal, Clock, Headphones } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Cpu,
      title: 'Prosesor Intel Enterprise Series',
      description: 'Ditenagai prosesor Intel Platinum 8370C, Xeon v4 2695, dan Xeon Gold 6154 berdaya komputasi tinggi, menjamin TPS server Minecraft tetap stabil 20.0 bebas lag spike.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'CosmicGuard Anti-DDoS 3.2 Tbps',
      description: 'Filter mitigasi DDoS layer 4 dan layer 7 khusus game Minecraft. Melindungi server kamu dari bot attack, TCP flood, dan exploit crash.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Zap,
      title: 'Enterprise Gen4 NVMe SSD',
      description: 'Kecepatan read & write hingga 7.000 MB/s. Loading chunk dunia Minecraft, custom terrain, dan restart server berjalan dalam hitungan detik.',
      color: 'from-cyan-400 to-teal-500'
    },
    {
      icon: Terminal,
      title: 'Pterodactyl Panel Modern',
      description: 'Panel kontrol server game nomor 1 di dunia. Dilengkapi web file manager, console real-time, plugin installer, schedule task, dan sub-users.',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: RefreshCw,
      title: 'Automated Offsite Backup',
      description: 'Pencadangan data server berkala otomatis ke cloud storage terpisah. Kembalikan kondisi server kamu kapan saja hanya dengan 1 klik.',
      color: 'from-emerald-400 to-cyan-500'
    },
    {
      icon: Globe,
      title: 'Subdomain Gratis .mavix.id',
      description: 'Dapatkan domain server keren secara cuma-cuma (contoh: play.serverkamu.mavix.id) tanpa perlu ribet setting DNS manual.',
      color: 'from-sky-400 to-blue-500'
    },
    {
      icon: Database,
      title: 'Free MySQL Database',
      description: 'Database gratis terintegrasi untuk plugin populer seperti LuckPerms, CoreProtect, Vault, EssentialsX, dan plugin ekonomi server.',
      color: 'from-cyan-500 to-sky-600'
    },
    {
      icon: Clock,
      title: 'Instant Auto Setup < 60 Detik',
      description: 'Server langsung dideploy otomatis setelah konfirmasi pembayaran di WhatsApp. Tidak perlu menunggu lama untuk mulai mabar.',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: Headphones,
      title: '24/7 Human WhatsApp CS',
      description: 'Bantuan teknis langsung dari admin berpengalaman via WhatsApp dan Discord. Siap bantu install modpack, plugin, hingga troubleshoot error.',
      color: 'from-rose-400 to-pink-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-[#06080f] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Infrastruktur Kelas Enterprise</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Performa Tanpa Kompromi untuk <span className="text-cyan-400">Server Impianmu</span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Kami mengutamakan kualitas hardware terbaik agar gameplay Minecraft kamu dan komunitas tetap mulus tanpa lag spike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#090e1a] border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(6,182,212,0.15)]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-0.5 mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                  <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-300" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
