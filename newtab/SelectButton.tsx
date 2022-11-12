import { useRef, useCallback } from 'react'


export interface SelectButtonProps {
  onSelect?: (files: File[]) => void
}

export const SelectButton = (props: SelectButtonProps) => {
  const { onSelect } = props
  const { openSelector } = useFileSelector()

  const handleClick = useCallback(() => {
    openSelector(onSelect)
  }, [])

  return (
    <button
      className={`
        fixed top-3 right-4 w-7 h-7
        flex justify-center items-center

        truncate select-none text-lg text-gray-200/75 bg-gray-400/30
        border border-gray-300/50

        rounded-full shadow-sm
        transition-[width,color,background-color,border-color] duration-200 ease-in-out

        after:content-['+'] after:relative after:-top-px
        hover:after:content-['+_Pictures']
        hover:w-[84px] hover:text-sm hover:font-normal
        hover:text-gray-200 hover:border-gray-200 hover:bg-gray-800/40
      `}
      onClick={handleClick}
    />
  )
}


let fileInput: HTMLInputElement | null = null

export const useFileSelector = () => {
  const onSelectRef = useRef<(files: File[]) => void>()
  const handleChange = useCallback(async () => {
    const files: File[] = [...fileInput!.files ?? []]
    if (files.length) {
      onSelectRef.current?.(files)
    }
  }, [])

  if (!fileInput) {
    fileInput = createFileInput(handleChange)
  }

  const openSelector = useCallback((onSelect?: (files: File[]) => void) => {
    onSelectRef.current = onSelect
    fileInput?.click()
  }, [])

  return {
    openSelector,
  }
}


const createFileInput = (onChange?: () => void): HTMLInputElement => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.multiple = true
  fileInput.accept = 'image/*'
  fileInput.style.position = 'fixed'
  fileInput.style.display = 'none'
  fileInput.onchange = onChange ?? (() => {})
  document.body.appendChild(fileInput)
  return fileInput
}
