import type { ImageLoaderProps } from 'next/image'

export function isCloudinaryUrl(src: string) {
  return typeof src === 'string' && src.includes('res.cloudinary.com')
}

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  const qualityValue = typeof quality === 'number' ? quality : 'auto'

  if (!isCloudinaryUrl(src)) {
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}w=${width}&q=${qualityValue}`
  }

  const transformation = `f_auto,q_${qualityValue},w_${width}`
  const marker = '/upload/'
  const markerIndex = src.indexOf(marker)

  if (markerIndex === -1) {
    return src
  }

  const prefix = src.slice(0, markerIndex + marker.length)
  const rest = src.slice(markerIndex + marker.length)

  const firstSlash = rest.indexOf('/')
  if (firstSlash > -1) {
    const firstSegment = rest.slice(0, firstSlash)
    const remainder = rest.slice(firstSlash + 1)
    const isVersionSegment = /^v\d+$/.test(firstSegment)
    const looksLikeTransform = /(^|,)(w_|h_|q_|f_|c_|g_|e_|dpr_|ar_|x_|y_|z_|r_|l_|u_)/.test(firstSegment)

    if (looksLikeTransform) {
      return `${prefix}${transformation}/${remainder}`
    }

    if (isVersionSegment) {
      return `${prefix}${transformation}/${rest}`
    }
  }

  return `${prefix}${transformation}/${rest}`
}
