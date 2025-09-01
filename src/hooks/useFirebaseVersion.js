import { useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { database } from '../config/firebase.js'
import { getGlobalJson, addGlobalJson } from '../utils/indexedDB.js'
import { handleAllData } from '../api/home.js'

const versionsDiffer = (stored, remote) => {
  if (!remote) return false
  if (!stored) return true
  const keys = ['version', 'homeData', 'mapImages', 'mapPath']
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if ((stored?.[key] ?? null) !== (remote?.[key] ?? null)) return true
  }
  return false
}

export default function useFirebaseVersion() {
  useEffect(() => {
    const dbRef = ref(database, '/dataVersions')

    const unsubscribe = onValue(dbRef, async (snapshot) => {
      try {
        const remote = snapshot.val() || null
        if (!remote) return

        const stored = await getGlobalJson('dataVersion')

        if (versionsDiffer(stored, remote)) {
          await handleAllData(true)
          await addGlobalJson('dataVersion', remote)
          try {
            window.dispatchEvent(new CustomEvent('data-version-updated', { detail: remote }))
          } catch (_) {}
        }
      } catch (e) {
        console.log('Error handling Firebase dataVersions:', e)
      }
    })

    return () => unsubscribe()
  }, [])
}


