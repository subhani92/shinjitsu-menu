import React, { useState, useRef, useCallback, useEffect } from 'react';
import './CameraUpload.css';

export default function CameraUpload({ onScanComplete, isLoading }) {
  const [preview, setPreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Camera not available. Try uploading a photo instead.');
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    stopCamera();
    setPreview(canvas.toDataURL('image/jpeg', 0.85));
  };

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleScan = async () => {
    if (!preview || isLoading) return;
    onScanComplete({
      imageBase64: preview.split(',')[1],
      mimeType: preview.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg',
      preview,
    });
  };

  const reset = () => {
    stopCamera();
    setPreview(null);
    setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="camera-upload">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {cameraError && (
        <div className="camera-upload__error">
          <p>{cameraError}</p>
          <button onClick={() => setCameraError(null)}>Dismiss</button>
        </div>
      )}

      {preview ? (
        <div className="camera-upload__preview-wrap">
          <div className="camera-upload__preview">
            <img src={preview} alt="Menu preview" />
          </div>
          <div className="camera-upload__actions">
            <button className="camera-upload__btn camera-upload__btn--secondary" onClick={reset}>
              <RetakeIcon /> Retake
            </button>
            <button className="camera-upload__btn camera-upload__btn--primary" onClick={handleScan} disabled={isLoading}>
              {isLoading ? (
                <span className="camera-upload__spinner">
                  <span className="spinner" /> Analyzing...
                </span>
              ) : (
                <><ScanIcon /> Scan Menu</>
              )}
            </button>
          </div>
        </div>
      ) : cameraActive ? (
        <div className="camera-upload__live">
          <video ref={videoRef} autoPlay playsInline muted className="camera-upload__video" />
          <div className="camera-upload__guide" />
          <div className="camera-upload__live-actions">
            <button className="camera-upload__shutter" onClick={capturePhoto} />
          </div>
          <div className="camera-upload__live-bottom">
            <button className="camera-upload__cancel" onClick={reset}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="camera-upload__idle">
          <div className="camera-upload__idle-icon">
            <CameraIcon />
          </div>
          <h3 className="camera-upload__idle-title">Scan a Japanese Menu</h3>
          <p className="camera-upload__idle-subtitle">Take a photo or upload an image — we'll analyze every dish for hidden ingredients</p>
          <div className="camera-upload__idle-buttons">
            <button className="camera-upload__btn-camera" onClick={startCamera}>
              <CameraIcon small /> Take Photo
            </button>
            <button className="camera-upload__btn-upload" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon /> Upload Image
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="camera-upload__input"
      />
    </div>
  );
}

function CameraIcon({ small }) {
  const s = small ? 18 : 40;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={small ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function RetakeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  );
}