import { useState, useRef, useEffect } from 'react'

// Most reference photos are cropped by object-fit: cover to fit the small
// preview box. This lets you drag to pan around inside that crop instead of
// only ever seeing the centered slice. Double-click resets to center.
export default function PannableImage({ src, alt, className }) {
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const wrapRef = useRef(null)
  const dragging = useRef(false)
  const start = useRef({ x: 0, y: 0, px: 50, py: 50 })

  useEffect(() => { setPos({ x: 50, y: 50 }) }, [src])

  function onPointerDown(e) {
    dragging.current = true
    start.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging.current || !wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const dx = ((e.clientX - start.current.x) / rect.width) * 100
    const dy = ((e.clientY - start.current.y) / rect.height) * 100
    setPos({
      x: Math.min(100, Math.max(0, start.current.px - dx)),
      y: Math.min(100, Math.max(0, start.current.py - dy)),
    })
  }

  function onPointerUp() {
    dragging.current = false
  }

  return (
    <div
      ref={wrapRef}
      className="pannable-image-wrap"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={() => setPos({ x: 50, y: 50 })}
    >
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
        style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
      />
    </div>
  )
}
