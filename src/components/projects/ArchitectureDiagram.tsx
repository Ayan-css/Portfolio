import { useState } from 'react'
import { motion } from 'framer-motion'
import { flagship } from '@/lib/data'
import { useReducedMotion } from '@/hooks/useMediaQuery'

type NodeId = 'phone' | 'api' | 'pay' | 'store' | 'db' | 'agent' | 'printer'

interface Node {
  id: NodeId
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
}

const NODES: Node[] = [
  { id: 'phone', x: 8, y: 112, w: 118, h: 58, title: "Customer's phone", sub: 'browser, no app', color: '#7d7d87' },
  { id: 'pay', x: 178, y: 14, w: 142, h: 52, title: 'Razorpay', sub: 'verified webhook', color: '#3395ff' },
  { id: 'api', x: 178, y: 112, w: 142, h: 58, title: 'Express API', sub: 'TypeScript · Docker', color: '#5fa04e' },
  { id: 'store', x: 178, y: 216, w: 142, h: 52, title: 'Supabase storage', sub: 'signed upload URL', color: '#5fa04e' },
  { id: 'db', x: 372, y: 112, w: 138, h: 58, title: 'PostgreSQL', sub: 'Prisma ORM', color: '#4a90b8' },
  { id: 'agent', x: 560, y: 112, w: 150, h: 58, title: 'Print agent', sub: 'C# .NET 8 · shop PC', color: '#9b4f96' },
  { id: 'printer', x: 560, y: 216, w: 150, h: 52, title: 'Existing printer', sub: 'no new hardware', color: '#7d7d87' },
]

interface Edge {
  d: string
  label: string
  lx: number
  ly: number
  dashed?: boolean
  /** Which state machine this edge belongs to — drives the decoupling highlight. */
  lane?: 'payment' | 'print'
}

const EDGES: Edge[] = [
  { d: 'M126 141 H178', label: 'scan → upload', lx: 152, ly: 133 },
  { d: 'M249 66 V112', label: 'payment.captured', lx: 253, ly: 92, lane: 'payment' },
  { d: 'M249 216 V170', label: 'file', lx: 253, ly: 196 },
  { d: 'M320 141 H372', label: 'job row', lx: 346, ly: 133 },
  { d: 'M510 141 H560', label: 'poll · claim', lx: 535, ly: 133, dashed: true, lane: 'print' },
  { d: 'M635 170 V216', label: 'print', lx: 641, ly: 196, lane: 'print' },
]

/** Which parts of the picture each decision is actually about. */
const FOCUS: Record<string, { nodes: NodeId[]; lanes: ('payment' | 'print')[] }> = {
  'decoupled-state': { nodes: ['pay', 'api', 'agent'], lanes: ['payment', 'print'] },
  'integer-paise': { nodes: ['db', 'api'], lanes: [] },
  'frozen-rate-card': { nodes: ['api', 'db'], lanes: [] },
}

export function ArchitectureDiagram() {
  const [selected, setSelected] = useState<string | null>(null)
  const reduced = useReducedMotion()

  const focus = selected ? FOCUS[selected] : null
  const dim = (id: NodeId) => (focus ? (focus.nodes.includes(id) ? 1 : 0.28) : 1)
  const dimEdge = (edge: Edge) =>
    focus ? (edge.lane && focus.lanes.includes(edge.lane) ? 1 : 0.2) : 0.75

  const detail = flagship.decisions.find((d) => d.id === selected)

  return (
    <div>
      <p className="text-os-dim mb-4 text-[14px] leading-relaxed">
        One request path, two independent state machines. Select a decision to see which part of
        the picture it governs and why it was built that way.
      </p>

      <div className="border-os-line bg-os-void/60 os-scroll overflow-x-auto rounded-lg border p-3">
        <svg viewBox="0 0 720 282" className="h-auto w-full min-w-[640px]" role="img"
          aria-label="PrintOK architecture: customer phone to Express API, with Razorpay webhooks driving payment state and a C# agent on the shop's PC driving print state.">
          <defs>
            <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#4a4a52" />
            </marker>
          </defs>

          {EDGES.map((edge) => (
            <motion.g key={edge.d} animate={{ opacity: dimEdge(edge) }} transition={{ duration: reduced ? 0 : 0.18 }}>
              <path
                d={edge.d}
                fill="none"
                stroke={edge.lane === 'payment' ? '#3395ff' : edge.lane === 'print' ? '#9b4f96' : '#4a4a52'}
                strokeWidth="1.5"
                strokeDasharray={edge.dashed ? '4 4' : undefined}
                markerEnd="url(#arrow)"
              />
              <text x={edge.lx} y={edge.ly} className="chrome" fontSize="9" fill="#62626c">
                {edge.label}
              </text>
            </motion.g>
          ))}

          {NODES.map((node) => {
            const lit = focus?.nodes.includes(node.id) ?? false
            return (
              <motion.g key={node.id} animate={{ opacity: dim(node.id) }} transition={{ duration: reduced ? 0 : 0.18 }}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="6"
                  fill="#141416"
                  stroke={lit ? '#e8a33d' : node.color}
                  strokeWidth={lit ? 1.8 : 1.1}
                  strokeOpacity={lit ? 1 : 0.55}
                />
                <text x={node.x + 11} y={node.y + 23} className="chrome" fontSize="11" fill="#e7e7ea">
                  {node.title}
                </text>
                <text x={node.x + 11} y={node.y + 39} className="chrome" fontSize="9" fill={node.color}>
                  {node.sub}
                </text>
              </motion.g>
            )
          })}

          {/* Lane labels: the two state machines that must never merge. */}
          <text x="330" y="30" className="chrome" fontSize="9" fill="#3395ff" opacity={focus?.lanes.includes('payment') ? 1 : 0.5}>
            payment state
          </text>
          <text x="460" y="262" className="chrome" fontSize="9" fill="#9b4f96" opacity={focus?.lanes.includes('print') ? 1 : 0.5}>
            print state
          </text>
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {flagship.decisions.map((decision, index) => {
          const isActive = selected === decision.id
          return (
            <button
              key={decision.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelected(isActive ? null : decision.id)}
              className={`chrome rounded-md border px-3 py-1.5 text-[11px] transition-colors duration-150 ${
                isActive
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-os-line text-os-dim hover:border-os-line-strong hover:text-os-text'
              }`}
            >
              <span className="text-os-faint mr-2">0{index + 1}</span>
              {decision.short}
            </button>
          )
        })}
      </div>

      {detail && (
        <motion.div
          key={detail.id}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="border-accent/30 bg-accent/[0.05] mt-3 rounded-lg border p-4"
        >
          <h4 className="chrome text-accent text-[12.5px]">{detail.title}</h4>
          <p className="text-os-dim mt-2 text-[14px] leading-relaxed">{detail.detail}</p>
        </motion.div>
      )}
    </div>
  )
}
