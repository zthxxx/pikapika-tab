export type HashKey = `sha1-${string}`

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

export const fileToBlobUrl = (file?: File): string | Promise<string> => {
  if (!file) return ''

  const reader = new FileReader()
  return new Promise(resolve => {
    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result as string)
      },
      false,
    )

    reader.readAsDataURL(file);
  })
}
