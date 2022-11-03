import { useState, useCallback } from 'react'
import {
  getRandomPicture,
  restorePictures,
} from './store'
import { fileToBlobUrl } from './file'
import { SelectButton } from './SelectButton'


export const NewTabPage = () => {
  const {
    backgroundUrl,
    setBackgroundUrl,
  } = useBackgroundUrl()

  const handleSelect = useCallback(async (files: File[]) => {
    await restorePictures(files)
    const randomPicture = await getRandomPicture()
    if (!randomPicture) return

    const backgroundUrl = await fileToBlobUrl(randomPicture)
    setBackgroundUrl(`url(${backgroundUrl})`)
  }, [])

  return (
    <>
      <div
        className={`
          w-full h-full bg-cover bg-center select-none
          transition-all duration-500 ease-in-out
        `}
        style={{
          backgroundImage: backgroundUrl,
          opacity: backgroundUrl ? 1 : 0,
        }}
      >
      </div>

      <SelectButton
        onSelect={handleSelect}
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
