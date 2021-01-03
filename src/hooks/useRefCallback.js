import { useCallback, useState } from 'react'

function useRefCallback() {
  const [ref, setRef] = useState()
  const refCallback = useCallback((node) => {
    setRef(node)
  }, [])

  console.log('REF', ref)

  return [ref, refCallback]
}

export default useRefCallback
