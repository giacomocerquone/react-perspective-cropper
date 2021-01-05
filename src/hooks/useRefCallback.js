import { useCallback, useState } from 'react'

function useRefCallback() {
  const [ref, setRef] = useState()
  const refCallback = useCallback((node) => {
    setRef(node)
  }, [])

  return [ref, refCallback]
}

export default useRefCallback
