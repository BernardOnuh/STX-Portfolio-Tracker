// src/components/Portfolio.jsx
import React, { useEffect, useState } from 'react'
import { getAccountInfo, getTxsForAddress } from '../lib/api'
import { TrendingUp, TrendingDown, Trash2, ExternalLink, Zap, DollarSign } from 'lucide-react'

export default function Portfolio({ addresses, removeAddress, price }) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchAll() {
      if (!addresses || addresses.length === 0) { setData({}); return }
      setLoading(true)
      const out = {}
      for (const addr of addresses) {
        try {
          const acc = await getAccountInfo(addr)
          const txs = await getTxsForAddress(addr, 5)
          out[addr] = { account: acc, txs: txs || [], error: null }
        } catch (e) {
          out[addr] = { account: null, txs: [], error: e.message }
        }
      }
      if (!cancelled) setData(out)
      setLoading(false)
    }
    fetchAll()
    return () => cancelled = true
  }, [addresses])

  function fmt(micro) {
    if (micro == null) return '-'
    return (micro / 1_000_000).toFixed(6)
  }

  const totalStx = Object.values(data).reduce((s, item) => {
    if (!item || !item.account) return s
    return s + Number(item.account.balance || 0)
  }, 0) / 1_000_000

  const totalUSD = price ? totalStx * price : 0

  return (
    <section>
      {/* Loading State */}
      {loading && (
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/30 flex items-center gap-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold text-orange-400">Refreshing portfolio data...</span>
        </div>
      )}

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="border-2 border-dashed border-orange-500/30 rounded-2xl p-12 text-center">
          <Wallet className="w-12 h-12 text-orange-500/50 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-400">No addresses tracked yet</p>
          <p className="text-sm text-gray-500 mt-2">Add an address above to get started</p>
        </div>
      )}

      {/* Portfolio Summary */}
      {addresses.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Total STX Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-gray-800 hover:border-orange-500/50 bg-gradient-to-br from-gray-900/50 to-black/50 p-8 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total STX</span>
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
                {totalStx.toFixed(6)}
              </p>
              <p className="text-sm text-gray-500">Across {addresses.length} address{addresses.length !== 1 ? 'es' : ''}</p>
            </div>
          </div>

          {/* Total USD Card */}
          <div className="relative group overflow-hidden rounded-2xl border border-gray-800 hover:border-green-500/50 bg-gradient-to-br from-gray-900/50 to-black/50 p-8 backdrop-blur-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30">
                    <DollarSign className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Value</span>
                </div>
                {totalUSD > 0 && <TrendingUp className="w-5 h-5 text-green-400" />}
              </div>
              <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                ${totalUSD.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Based on current price</p>
            </div>
          </div>
        </div>
      )}

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((addr, idx) => {
          const d = data[addr]
          const bal = d && d.account ? d.account.balance : null
          const balStx = bal ? bal / 1_000_000 : 0
          const balUSD = price && bal ? (bal / 1_000_000) * price : 0
          const hasError = d && d.error

          return (
            <div 
              key={addr} 
              className={`relative group overflow-hidden rounded-2xl border transition-all duration-300 ${
                hasError 
                  ? 'border-red-500/30 hover:border-red-500/60 bg-gradient-to-br from-red-500/5 to-transparent' 
                  : 'border-gray-800 hover:border-orange-500/50 bg-gradient-to-br from-gray-900/50 to-black/50'
              } p-6 backdrop-blur-sm`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 ${
                hasError ? 'bg-red-500' : 'bg-orange-500'
              }`} />

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</p>
                    <p className="font-mono text-sm text-orange-400 break-all font-bold hover:text-orange-300 transition-colors">{addr}</p>
                  </div>
                  <button
                    onClick={() => removeAddress(addr)}
                    className="ml-2 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/60 transition-all duration-300 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Balance Section */}
                {hasError ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                    <p className="text-sm text-red-400 font-semibold">Error loading balance</p>
                    <p className="text-xs text-red-500 mt-1">{d.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 pb-4 border-b border-gray-800">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">STX Balance</p>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-1">
                        {balStx.toFixed(4)}
                      </p>
                      {price && <p className="text-sm text-green-400 font-bold">${balUSD.toFixed(2)}</p>}
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
                        <p className="text-xs text-gray-500 font-bold">Nonce</p>
                        <p className="text-lg font-black text-white">{d?.account?.nonce ?? '—'}</p>
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
                        <p className="text-xs text-gray-500 font-bold">Status</p>
                        <p className="text-sm font-bold text-green-400">Active</p>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="border-t border-gray-800 pt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recent Txs</p>
                      <div className="space-y-2">
                        {d && d.txs && d.txs.length > 0 ? (
                          d.txs.slice(0, 3).map(tx => {
                            const id = tx.tx_id || tx.id
                            const type = tx.tx_type || tx.type || 'transaction'
                            return (
                              <div 
                                key={id} 
                                className="flex items-center justify-between p-2 rounded-lg bg-gray-900/50 hover:bg-gray-900/80 border border-gray-800/50 hover:border-gray-700 transition-all cursor-pointer group"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-xs text-gray-400 truncate group-hover:text-orange-400 transition-colors">
                                    {id?.slice(0, 14)}...
                                  </p>
                                  <p className="text-xs text-gray-500 capitalize mt-0.5">{type}</p>
                                </div>
                                <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-orange-400 flex-shrink-0 ml-2 transition-colors" />
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-xs text-gray-500 italic">No recent transactions</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommended Actions */}
      {addresses.length > 0 && (
        <div className="mt-12 border-2 border-dashed border-orange-500/30 rounded-2xl p-8 text-center bg-gradient-to-br from-orange-500/5 to-transparent">
          <p className="text-sm text-gray-400">
            💡 <strong>Tip:</strong> Add more addresses to get a complete view of your portfolio across multiple wallets
          </p>
        </div>
      )}

      {/* Global Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:wght@400;600;700&display=swap');

        h1, h2, h3, h4, h5, h6, .font-black, .font-bold {
          font-family: 'Orbitron', sans-serif;
        }

        .font-mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div[style*="animation-delay"] {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  )
}