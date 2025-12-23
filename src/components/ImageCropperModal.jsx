import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react'
import getCroppedImg from '../utils/cropImage'

const ImageCropperModal = ({ isOpen, onClose, onCropComplete, imageSrc }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)

  const onCropChange = (crop) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom) => {
    setZoom(zoom)
  }

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      onCropComplete(croppedImage)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
        setLoading(false)
    }
  }

  if (!isOpen || !imageSrc) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[80vh] md:h-[600px]">
        
        {/* Header */}
        <div className="p-4 bg-black text-white flex justify-between items-center z-10">
            <h3 className="font-bold uppercase text-sm">Ajustar Foto de Perfil</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <ZoomOut size={18} className="text-gray-400"/>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
                <ZoomIn size={18} className="text-gray-400"/>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 uppercase text-sm transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-black text-white rounded-lg font-bold uppercase text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {loading ? 'Procesando...' : <><Check size={18}/> Guardar Foto</>}
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropperModal
