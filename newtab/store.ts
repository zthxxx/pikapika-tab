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

export const randomOne = <T>(list: T[]): T | undefined => {
  const index = Math.floor(Math.random() * list.length)
  return list[index]
}

export const getRandomPicture = async (): Promise<File | undefined> => {
  const pictureList = await getAllPictureKeys()
  const fileKey = randomOne(pictureList)
  if (!fileKey) return

  const file = await store.getItem<File>(fileKey)
  return file ?? undefined
}

export const savePictures = async ({ files, onProgress }: {
  files: File[];
  onProgress?: (progress: number) => void;
}) => {
  if (!files.length) return

  const pictureList: HashKey[] = await getAllPictureKeys()
  const pictureSet: Set<HashKey> = new Set(pictureList)
  const additionList: HashKey[] = []

  let count = 0

  await Promise.all(files.map(async file => {
    const key = await getFileHash(file)

    if (pictureSet.has(key)) {
      count += 1
      onProgress?.(0.1 + count / files.length * 0.8)
      return
    }

    pictureSet.add(key)
    additionList.push(key)
    await store.setItem(key, file)

    // const thumb: Blob = await generateThumbnail({ file })
    // const thumbKey: ThumbKey = `thumb-${key}`
    // await store.setItem(thumbKey, thumb)

    count += 1
    onProgress?.(0.1 + count / files.length * 0.8)
  }))

  await store.setItem(listKey, [...pictureList, ...additionList])
  onProgress?.(1)
}
