export type HashKey = `sha1-${string}`
export type ThumbKey = `thumb-sha1-${string}`

/** width x height pixel */
export const defaultThumbSize: [number, number] = [480, 270]

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

export const getFileHash = async (file: File): Promise<HashKey> => {
  const buffer = await file.arrayBuffer()
  const sha1 = await crypto.subtle.digest('SHA-1', buffer)
  const sha1Hex = bufferToHex(sha1)
  return `sha1-${sha1Hex}`
}


const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!

export const generateThumbnail = ({ file, thumbSize = defaultThumbSize }: {
  file: File,
  /** width x height pixel */
  thumbSize?: [number, number],
  /** return thumb blob url */
}): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = function () {
      const scaleRatio = Math.min(thumbSize[0] / img.width, thumbSize[1] / img.height)
      const w = img.width * scaleRatio
      const h = img.height * scaleRatio

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = w
      canvas.height = h

      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        blob => resolve(blob!),
        file.type,
        0.8,
      )
    }
    img.src = URL.createObjectURL(file)
  })
}

export const fileToBlobUrl = (file?: File | Blob): string => {
  if (!file) return ''
  return URL.createObjectURL(file)
}
