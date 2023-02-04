import { useState, useCallback } from 'react'
import {
  getRandomPicture,
  savePictures,
  randomOne,
} from './store'
import { fileToBlobUrl } from './file'
import { SelectButton } from './SelectButton'
import { delay } from './utils'


export const NewTabPage = () => {
  const {
    backgroundUrl,
    setBackgroundUrl,
  } = useBackgroundUrl()

  const {
    progress,
    setProgress,
  } = useProgress()

  const handleSelect = useCallback(async (files: File[]) => {
    const randomPicture = randomOne(files)
    if (!randomPicture) return

    const backgroundUrl = fileToBlobUrl(randomPicture)
    setBackgroundUrl(`url(${backgroundUrl})`)

    setProgress(0.1)

    await savePictures({
      files,
      onProgress: setProgress,
    })

    await delay(1000)
    setProgress(null)
  }, [])

  return (
    <>
      {progress !== null && (
        <div
          className="fixed top-0 left-0 h-1 bg-pink-400 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      )}
      <div
        className={`
          w-screen h-screen bg-cover bg-center select-none
          transition-all duration-300 ease-in-out
        `}
        style={{
          backgroundImage: backgroundUrl,
          opacity: backgroundUrl ? 1 : 0,
        }}
      >
      </div>

      <SelectButton
        onSelect={handleSelect}
        disabled={progress !== null}
      />
    </>
  )
}

const firstPictureUrl = getRandomPicture().then(fileToBlobUrl)

const useBackgroundUrl = (): {
  backgroundUrl: string;
  setBackgroundUrl: (url: string) => void;
} => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('')

  if (!backgroundUrl) {
    firstPictureUrl.then(async url => {
      if (!url) return
      setBackgroundUrl(`url(${url})`)
    })
  }

  return {
    backgroundUrl,
    setBackgroundUrl,
  }
}

const useProgress = (): {
  /**
   * progress: 0 - 1, `null` means not work in progress
   */
  progress: number | null;
  setProgress: (progress: number | null) => void;
} => {
  const [progress, _setProgress] = useState<number | null>(null)
  const setProgress = (progress: number | null) => {
    if (progress === null) return _setProgress(null)

    _setProgress(Math.max(0, Math.min(progress, 1)))
  }

  return {
    progress,
    setProgress,
  }
}
