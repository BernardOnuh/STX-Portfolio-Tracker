// src/App.jsx
import React, { useState, useEffect } from 'react'
import Portfolio from './components/Portfolio'
import { getPriceUSD } from './lib/api'
import { connectWallet, getUserData, signOut, getUserAddressSafe, openTransfer } from './lib/wallet'
import { Wallet, TrendingUp, Send, Plus, LogOut } from 'lucide-react'

export default function App() {
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stx_addresses') || '[]') } catch (e) { return [] }
  })
  const [price, setPrice] = useState(null)
  const [user, setUser] = useState(() => {
    try { return getUserData() } catch (e) { return null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadPrice() { 
      setLoading(true)
      setPrice(await getPriceUSD())
      setLoading(false)
    }
    loadPrice()
  }, [])

  useEffect(() => {
    localStorage.setItem('stx_addresses', JSON.stringify(addresses))
  }, [addresses])

  async function handleConnect() {
    console.log('[app] handleConnect start')
    try {
      const u = await connectWallet()
      console.log('[app] connectWallet returned:', u)
      setUser(u)
      const addr = getUserAddressSafe()
      if (addr && !addresses.includes(addr)) {
        setAddresses(prev => [addr, ...prev])
      }
    } catch (err) {
      console.error('[app] connect error:', err)
      alert('Wallet connection failed — check console and ensure a compatible wallet extension is installed and popups are allowed.')
    }
  }

  function handleSignOut() {
    try {
      signOut()
      setUser(null)
    } catch (e) {
      console.warn('signOut error', e)
    }
  }

  function addAddress(addr) {
    if (!addr) return
    if (addresses.includes(addr)) return alert('Already added')
    setAddresses(prev => [addr, ...prev])
  }

  function removeAddress(addr) {
    setAddresses(prev => prev.filter(a => a !== addr))
  }

  function addMyAddress() {
    const a = getUserAddressSafe()
    if (!a) return alert('No connected address found')
    addAddress(a)
  }

  async function sendFlow() {
    const recipient = prompt('Recipient STX address:')
    if (!recipient) return
    const amount = prompt('Amount (STX):')
    if (!amount) return
    try {
      await openTransfer({ recipient, amount, memo: 'Sent via STX Portfolio Tracker' })
      alert('Transfer dialog opened in wallet.')
    } catch (e) {
      alert('Error opening transfer: ' + (e?.message || e))
    }
  }

  const totalStx = addresses.reduce((sum, addr) => sum, 0)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-black" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-red-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-l from-blue-600/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-orange-500/20 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg opacity-0 hover:opacity-20 blur-lg transition-all duration-500" />
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-2 rounded-lg border border-orange-500/30">
                    <Wallet className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600">
                      STX PORTFOLIO
                    </span>
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Track, manage & monitor your Stacks assets</p>
                </div>
              </div>

              {/* Price Display */}
              {price && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900/50 to-black/50 border border-orange-500/30 rounded-lg hover:border-orange-500/60 transition-all">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold">STX Price:</span>
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    ${price.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap gap-3">
              {!user ? (
                <button 
                  onClick={handleConnect}
                  className="relative group px-6 py-3 overflow-hidden rounded-lg font-black text-white uppercase tracking-wider text-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 group-hover:via-yellow-500 transition-all duration-500" />
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-orange-500/80 transition-all duration-300 rounded-lg blur" />
                  <span className="relative flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Connect Wallet
                  </span>
                </button>
              ) : (
                <>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all duration-300" />
                    <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/80 to-black/80 border border-gray-700/50 group-hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Connected</span>
                      <span className="text-sm font-mono text-orange-400">{getUserAddressSafe()?.slice(0, 12)}...{getUserAddressSafe()?.slice(-8)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={addMyAddress}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/40 hover:to-cyan-500/40 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60 py-3 px-4 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add My Address
                  </button>

                  <button 
                    onClick={sendFlow}
                    className="px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/40 hover:to-emerald-500/40 text-green-400 border border-green-500/30 hover:border-green-500/60 py-3 px-4 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send STX
                  </button>

                  <button 
                    onClick={handleSignOut}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 hover:border-red-500/60 py-3 px-4 rounded-lg transition-all duration-300 font-bold uppercase tracking-wider text-sm flex items-center gap-2 ml-auto"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Add Address Section */}
          <section className="mb-12">
            <div className="border-2 border-orange-500/30 rounded-2xl bg-gradient-to-br from-orange-500/5 to-red-600/5 p-8 hover:border-orange-500/60 transition-all">
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                Track New Address
              </h2>
              <div className="flex gap-3">
                <input 
                  id="newaddr" 
                  placeholder="Enter STX address to track (SP...)" 
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-700/50 hover:border-orange-500/50 focus:border-orange-500 text-white placeholder-gray-500 transition-all duration-300 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
                <button 
                  onClick={() => {
                    const v = document.getElementById('newaddr').value.trim()
                    if (v) { addAddress(v); document.getElementById('newaddr').value = '' }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 uppercase tracking-wider"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Portfolio Component */}
          <Portfolio addresses={addresses} removeAddress={removeAddress} price={price} />
        </main>

        {/* Footer */}
        <footer className="border-t border-orange-500/20 bg-black/50 backdrop-blur-lg mt-16 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
            <p>✨ Built for crypto enthusiasts • Data from Stacks API & CoinGecko • No private keys stored</p>
          </div>
        </footer>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=IBM+Plex+Mono:wght@400;600;700&display=swap');

        * {
          font-family: 'Orbitron', sans-serif;
        }

        code {
          font-family: 'IBM Plex Mono', monospace;
        }

        h1, h2, h3, h4, h5, h6, .font-black {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>
    </div>
  )
}