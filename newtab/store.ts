import { createInstance } from 'localforage'
import {
  type HashKey,
  getFileHash,
} from './file'


export const store = createInstance({
  name: 'pikapika-tab'
})

const listKey = 'picture-list'


const getStorePictureList = async (): Promise<`sha1-${string}`[]> => {
  return await store.getItem<HashKey[]>(listKey) ?? []
}

export const getRandomPicture = async (): Promise<File | undefined> => {
  const pictureList = await getStorePictureList()
  if (!pictureList.length) return

  const randomIndex = Math.floor(Math.random() * pictureList.length)
  const fileKey = pictureList[randomIndex]
  const file = await store.getItem<File>(fileKey)
  return file ?? undefined
}

export const restorePictures = async (files: File[]) => {
  const pictureList = await getStorePictureList()
  const pictureSet = new Set(pictureList)
  const filesMap: Record<HashKey, File> = {}

  await Promise.all(files.map(async file => {
    const hash = await getFileHash(file)
    filesMap[hash] = file
  }))

  const fileKeys = Object.keys(filesMap) as HashKey[]
  const fileKeySet = new Set(fileKeys)

  const removes = pictureList.filter(key => !fileKeySet.has(key))
  const addition = fileKeys.filter(key => !pictureSet.has(key))

  await Promise.all(removes.map(async key => {
    await store.removeItem(key)
  }))

  await Promise.all(addition.map(async key => {
    await store.setItem(key, filesMap[key])
  }))

  await store.setItem(listKey, fileKeys)
}
