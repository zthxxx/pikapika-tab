import { useRef, useCallback } from 'react'


export interface SelectButtonProps {
  onSelect?: (files: File[]) => void
}

export const SelectButton = (props: SelectButtonProps) => {
  const { onSelect } = props
  const fileSelectorRef = useRef<HTMLInputElement>(null)

  const openSelector = useCallback(() => {
    fileSelectorRef.current?.click()
  }, [])

  const handleChange = useCallback(async () => {
    const target: HTMLInputElement = fileSelectorRef.current!
    const files: File[] = [...target.files ?? []]
    if (files.length) {
      onSelect?.(files)
    }
  }, [])

  return (
    <>
      <input
        ref={fileSelectorRef}
        type="file"
        multiple
        accept="image/*"
        className="fixed hidden"
        onChange={handleChange}
      />
      <button
        className={`
          fixed top-3 right-4 w-7 h-7
          flex justify-center items-center

          truncate select-none text-lg text-gray-200/75 bg-gray-400/30
          border border-gray-300/50

          rounded-full shadow-sm
          transition-all duration-2300 ease-in-out

          after:content-['+'] after:relative after:-top-px
          hover:after:content-['+_Pictures']
          hover:w-[84px] hover:text-sm hover:font-normal
          hover:text-gray-200 hover:border-gray-200 hover:bg-gray-800/40
        `}
        onClick={openSelector}
      />
    </>
  )
}
