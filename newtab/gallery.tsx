import { useRef, useCallback, useState, useEffect } from 'react'
import {
  getAllPictureKeys,
} from './store'
import {
  type HashKey,
  type ThumbKey,
} from './file'


export const PictureList = () => {
  const [pictureKeys, setPictureKeys] = useState<HashKey[]>([])
  const [thumbKeys, setThumbKeys] = useState<ThumbKey[]>([])

  useEffect(() => {

  }, [])
}
