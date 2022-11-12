import { createInstance } from 'localforage'
import {
  type HashKey,
  type ThumbKey,
  getFileHash,
  generateThumbnail,
} from './file'


export const store = createInstance({
  name: 'pikapika-tab'
})

const listKey = 'picture-list'


export const getAllPictureKeys = async (): Promise<HashKey[]> => {
  return await store.getItem<HashKey[]>(listKey) ?? []
}


export const getRandomPicture = async (): Promise<File | undefined> => {
  const pictureList = await getAllPictureKeys()
  if (!pictureList.length) return

  const randomIndex = Math.floor(Math.random() * pictureList.length)
  const fileKey = pictureList[randomIndex]
  const file = await store.getItem<File>(fileKey)
  return file ?? undefined
}

export const savePictures = async (files: File[]) => {
  const pictureList: HashKey[] = await getAllPictureKeys()
  const pictureSet: Set<HashKey> = new Set(pictureList)
  const filesMap: Record<HashKey, File> = {}

  await Promise.all(files.map(async file => {
    const hash = await getFileHash(file)
    filesMap[hash] = file
  }))

  const fileKeys = Object.keys(filesMap) as HashKey[]
  const addition = fileKeys.filter(key => !pictureSet.has(key))

  await Promise.all(addition.map(async key => {
    const file = filesMap[key]
    const thumb: Blob = await generateThumbnail({ file })
    const thumbKey: ThumbKey = `thumb-${key}`
    await store.setItem(key, filesMap[key])
    await store.setItem(thumbKey, thumb)
    pictureSet.add(key)
  }))

  await store.setItem(listKey, [...pictureList, ...addition])
}
