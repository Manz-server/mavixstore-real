import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana alur pemesanan hosting Minecraft di Mavix Store?',
      a: 'Alurnya sangat ringkas dan otomatis: (1) Pilih paket (Lite, Basic, atau Prime) dan tentukan RAM, (2) Konfigurasi nama server, subdomain, dan data kamu, (3) Lakukan pembayaran via QRIS atau Transfer Bank, dan (4) Klik Teleportasi ke WhatsApp. Sistem akan langsung mengarahkan kamu ke WhatsApp Admin dengan format pesanan lengkap untuk aktivasi instan akun Pterodactyl Panel kamu.'
    },
    {
      q: 'Berapa lama proses pembuatan server setelah saya kirim pesan di WhatsApp?',
      a: 'Kurang dari 1 hingga 5 menit! Setelah admin menerima konfirmasi dan bukti transfer di WhatsApp, server kamu langsung dibuat secara otomatis di node pilihan kamu dan detail login Pterodactyl Panel (URL, Username, Password) akan dikirimkan langsung ke chat WhatsApp kamu.'
    },
    {
      q: 'Berapa harga per GB untuk masing-masing paket?',
      a: 'Mavix Store menyediakan 3 paket fleksibel: Paket Lite seharga Rp 5.000 / GB / bulan (hemat & stabil dengan Intel Platinum 8370C), Paket Basic seharga Rp 8.000 / GB / bulan (paling populer dengan Intel Xeon v4 2695), dan Paket Prime seharga Rp 12.500 / GB / bulan (performa sultan dengan Intel Xeon Gold 6154).'
    },
    {
      q: 'Apakah server mendukung pemain Minecraft Cracked (TLauncher) dan Bedrock/PE (HP)?',
      a: 'Ya, 100% mendukung! Kamu dapat mengaktifkan opsi "Online Mode: False" di file server.properties melalui panel untuk pemain non-original, dan menginstall plugin GeyserMC + Floodgate agar teman yang main di HP (Minecraft Bedrock / Pocket Edition) bisa mabar bersama pemain Java di satu server yang sama.'
    },
    {
      q: 'Apakah saya bisa mengubah versi Minecraft atau install plugin & modpack sendiri?',
      a: 'Tentu saja! Kamu mendapatkan akses penuh (Full Root Access) ke Pterodactyl Panel. Kamu bisa mengganti JAR kapan saja (Paper, Purpur, Forge, Fabric, Mohist), mengupload plugin (.jar), memasang custom world, mengatur konfigurasi config.yml, dan menggunakan Web File Manager ataupun SFTP.'
    },
    {
      q: 'Apakah bisa upgrade atau tambah RAM di tengah bulan jika pemain bertambah?',
      a: 'Bisa banget! Kamu cukup menghubungi Admin via WhatsApp untuk request upgrade RAM. Semua data dunia, plugin, dan pemain kamu tetap aman tanpa perlu reset server.'
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Kami menerima QRIS (semua e-wallet seperti GoPay, OVO, DANA, ShopeePay, LinkAja) serta semua Mobile Banking (BCA, Mandiri, BRI, BNI, Jago, SeaBank, dll). Selain itu kami juga menerima transfer langsung ke rekening bank.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-[#06080f] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Pertanyaan yang <span className="text-cyan-400">Sering Ditanyakan</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Punya pertanyaan lain? Jangan ragu untuk langsung chat Admin Mavix Store via WhatsApp.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#090d18] border border-slate-800/80 overflow-hidden transition-colors hover:border-cyan-500/30"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-white text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <div className={`p-1 rounded-lg bg-slate-800/80 text-cyan-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 bg-cyan-950/70' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
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
