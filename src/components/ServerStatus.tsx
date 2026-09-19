import { useState } from 'react';
import { NODE_LOCATIONS } from '../data/plans';
import { Activity, Wifi, Server, CheckCircle2, RotateCw, Globe, ShieldCheck } from 'lucide-react';

export default function ServerStatus() {
  const [nodes, setNodes] = useState([
    {
      ...NODE_LOCATIONS[0],
      uptime: '99.99%',
      tps: '20.0',
      load: '38%',
      status: 'Operational',
      ip: 'sg1.mavixstore.id'
    },
    {
      ...NODE_LOCATIONS[1],
      uptime: '99.95%',
      tps: '20.0',
      load: '44%',
      status: 'Operational',
      ip: 'jkt1.mavixstore.id'
    },
    {
      ...NODE_LOCATIONS[2],
      uptime: '99.98%',
      tps: '20.0',
      load: '31%',
      status: 'Operational',
      ip: 'de1.mavixstore.id'
    }
  ]);

  const [isTesting, setIsTesting] = useState(false);

  const handleTestPing = () => {
    setIsTesting(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        pingMs: Math.max(4, Math.round(node.pingMs + (Math.random() - 0.5) * 4))
      })));
      setIsTesting(false);
    }, 1200);
  };

  return (
    <section id="status" className="py-20 bg-gradient-to-b from-[#020b18] via-[#04132a] to-[#020b18] relative border-t border-[#12345e] overflow-hidden">
      {/* Subtle light-green ambient glow */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[300px] bg-emerald-500/[0.045] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#062634] border border-[#00d2ff]/30 text-cyan-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>Real-time Node Monitoring</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="text-[10px] text-[#4ade80] font-bold uppercase tracking-wider">100% Normal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Status Server & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-[#4ade80]">Jaringan Global</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Semua node server dipantau 24/7 dengan sistem failover otomatis dan mitigasi DDoS aktif.
            </p>
          </div>

          <button
            onClick={handleTestPing}
            disabled={isTesting}
            className="flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#0a2347] hover:bg-[#0e2f5e] border border-[#00d2ff]/40 text-cyan-300 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 self-start md:self-auto cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-[#4ade80]' : ''}`} />
            <span>{isTesting ? 'Menguji Latency...' : 'Uji Ulang Ping Sekarang'}</span>
          </button>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-6 rounded-[28px] bg-[#061833] border border-[#12345e] hover:border-[#4ade80]/40 hover:shadow-[0_0_35px_rgba(74,222,128,0.15)] transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{node.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      {node.name}
                    </h3>
                    <span className="text-[11px] text-[#94a3b8] font-mono">
                      {node.ip}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#062e24] text-[#4ade80] border border-[#4ade80]/40 shadow-[0_0_8px_rgba(74,222,128,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.9)]" />
                  <span>{node.status}</span>
                </span>
              </div>

              {/* Ping metric box */}
              <div className="p-3.5 rounded-2xl bg-[#0a2347] border border-[#153a66] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[#00d2ff]" />
                  <span className="text-xs text-[#94a3b8]">Latency ke Client:</span>
                </div>
                <div className="text-base font-mono font-black text-[#00d2ff]">
                  ~{node.pingMs} ms
                </div>
              </div>

              {/* Stats detail row with subtle light green TPS highlight */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-[#0a2347] border border-[#153a66]">
                  <div className="text-[10px] text-[#94a3b8]">TPS Game</div>
                  <div className="text-xs font-mono font-black text-[#4ade80] mt-0.5">{node.tps}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a2347] border border-[#153a66]">
                  <div className="text-[10px] text-[#94a3b8]">Uptime 30d</div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">{node.uptime}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a2347] border border-[#153a66]">
                  <div className="text-[10px] text-[#94a3b8]">Node Load</div>
                  <div className="text-xs font-mono font-bold text-[#00d2ff] mt-0.5">{node.load}</div>
                </div>
              </div>

              <div className="text-[11px] text-[#94a3b8] pt-2 border-t border-[#12345e] flex items-center justify-between">
                <span>🏷️ {node.tag}</span>
                <span className="text-[10px] text-[#4ade80] font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
