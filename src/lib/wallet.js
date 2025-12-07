import { AppConfig, showConnect, UserSession, openSTXTransfer } from '@stacks/connect'
import { makeStandardSTXPostCondition, FungibleConditionCode } from '@stacks/transactions'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

export function isSignedIn(){
  return userSession.isUserSignedIn()
}

export function getUserData(){
  try {
    return userSession.loadUserData()
  } catch(e){ return null }
}

export async function connectWallet(){
  return new Promise((resolve, reject) => {
    try{
      showConnect({
        appDetails: { name: 'STX Portfolio Tracker', icon: window.location.origin + '/icon.png' },
        onFinish: () => {
          const u = userSession.loadUserData()
          resolve(u)
        },
        onCancel: () => reject(new Error('User cancelled')),
      })
    }catch(e){
      reject(e)
    }
  })
}

export function signOut(){
  try { userSession.signUserOut(window.location.origin) } catch(e){}
}

export function getUserAddressSafe(){
  const u = getUserData()
  if(!u) return null
  // newer Connect returns profile.stxAddress as object or string
  return (u?.profile?.stxAddress?.mainnet) || (u?.profile?.stxAddress) || (u?.profile?.stxAddress?.address) || null
}

export async function openTransfer({ recipient, amount, memo }){
  const amt = Number(amount)
  if(Number.isNaN(amt) || amt <= 0) throw new Error('Invalid amount')
  const postConditions = [
    makeStandardSTXPostCondition(
      getUserAddressSafe(),
      FungibleConditionCode.LessEqual,
      BigInt(Math.round(amt * 1_000_000))
    )
  ]
  return openSTXTransfer({
    recipient,
    amount: String(amt),
    memo: memo || '',
    network: undefined,
    postConditions
  })
}
