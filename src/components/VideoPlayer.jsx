import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Play, Pause, Volume2, VolumeX, Maximize, Minimize, AlertTriangle, Loader2 } from 'lucide-react';

const formatTime = (seconds) => {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const totalSecs = Math.floor(seconds);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ lesson, isOpen, onClose }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const volumeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Reset all state whenever a new lesson opens
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
      setHasError(false);
      setErrorMsg('');
      setIsBuffering(false);
    }
  }, [isOpen, lesson?.videoUrl]);

  // Auto-hide controls after 3s of inactivity while playing
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimerRef.current);
  }, [isPlaying, resetControlsTimer]);

  // Fullscreen change listener
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  if (!isOpen || !lesson) return null;

  // ── Video event handlers ──────────────────────────────────────
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || isDragging) return;
    setCurrentTime(v.currentTime);
    // Real buffered range
    if (v.buffered.length > 0) {
      const bufferedEnd = v.buffered.end(v.buffered.length - 1);
      setBuffered(duration > 0 ? (bufferedEnd / duration) * 100 : 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleError = () => {
    setHasError(true);
    setIsBuffering(false);
    setIsPlaying(false);
    setErrorMsg('Video failed to load. Please try again.');
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);
  const handlePlaying = () => { setIsBuffering(false); setIsPlaying(true); };

  // ── Seeking ──────────────────────────────────────────────────
  const seekToRatio = (ratio) => {
    if (!videoRef.current || !duration) return;
    const newTime = Math.min(Math.max(ratio, 0), 1) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    seekToRatio((e.clientX - rect.left) / rect.width);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
    const onMove = (ev) => {
      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect) return;
      seekToRatio((ev.clientX - rect.left) / rect.width);
    };
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const handleProgressTouch = (e) => {
    e.preventDefault();
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0] || e.changedTouches[0];
    seekToRatio((touch.clientX - rect.left) / rect.width);
  };

  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || hasError) return;
    v.paused ? v.play() : v.pause();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasVideo = !!lesson.videoUrl;

  return (
    <AnimatePresence>
      <motion.div
        key="player-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 md:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          ref={containerRef}
          key="player-container"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-5xl bg-black border border-neonCyan flex flex-col overflow-hidden"
          style={{ boxShadow: '0 0 40px rgba(0,240,255,0.12)', maxHeight: '95vh' }}
          onMouseMove={resetControlsTimer}
          onTouchStart={resetControlsTimer}
        >
          {/* ── Header ────────────────────────────────────── */}
          <div className="flex justify-between items-center px-3 py-2.5 md:px-4 md:py-3 border-b border-neonCyan/30 bg-deepBlue/50 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Lock className="w-3.5 h-3.5 text-neonCyan shrink-0" />
              <h3 className="text-neonCyan font-mono tracking-widest text-xs truncate">
                SECURE_STREAM // {lesson.title}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Video area ─────────────────────────────────── */}
          <div
            className="relative bg-black w-full"
            style={{ aspectRatio: '16 / 9' }}
          >
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-20"
              style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)' }}
            />

            {/* ── The actual video element ── */}
            {hasVideo && !hasError && (
              <video
                ref={videoRef}
                src={lesson.videoUrl}
                preload="metadata"
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => { setIsPlaying(false); setShowControls(true); }}
                onPlay={handlePlaying}
                onPause={() => setIsPlaying(false)}
                onWaiting={handleWaiting}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onClick={togglePlay}
              />
            )}

            {/* ── No video placeholder ── */}
            {!hasVideo && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20">
                <div className="w-14 h-14 border-2 border-t-neonCyan border-neonCyan/20 rounded-full animate-spin" />
                <p className="font-mono text-neonCyan text-xs md:text-sm tracking-widest animate-pulse">
                  DECRYPTING_VIDEO_STREAM...
                </p>
              </div>
            )}

            {/* ── Error state ── */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20 bg-black/80">
                <AlertTriangle className="w-12 h-12 text-electricRed" style={{ filter: 'drop-shadow(0 0 8px #ff003c)' }} />
                <p className="font-mono text-electricRed text-sm tracking-widest text-center px-4">{errorMsg}</p>
                <button
                  onClick={() => { setHasError(false); setErrorMsg(''); if (videoRef.current) videoRef.current.load(); }}
                  className="mt-2 px-6 py-2 border border-electricRed text-electricRed font-mono text-xs hover:bg-electricRed hover:text-black transition-all tracking-widest"
                >
                  RETRY
                </button>
              </div>
            )}

            {/* ── Buffering spinner overlay ── */}
            {isBuffering && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                <Loader2 className="w-10 h-10 text-neonCyan animate-spin" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
              </div>
            )}

            {/* ── Center play button (shown when paused) ── */}
            {hasVideo && !hasError && (
              <AnimatePresence>
                {!isPlaying && !isBuffering && (
                  <motion.button
                    key="play-overlay"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/70 border-2 border-neonCyan flex items-center justify-center hover:bg-neonCyan/20 transition-all"
                      style={{ boxShadow: '0 0 24px rgba(0,240,255,0.45)' }}
                    >
                      <Play className="w-7 h-7 md:w-9 md:h-9 text-neonCyan ml-1" />
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            )}

            {/* ── Custom Controls Bar ── */}
            {hasVideo && !hasError && (
              <AnimatePresence>
                {(showControls || !isPlaying) && (
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-0 left-0 right-0 z-30 px-3 pt-8 pb-3"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}
                  >
                    {/* ── Progress / seek bar ── */}
                    <div
                      ref={progressRef}
                      className="relative h-2 md:h-2.5 w-full bg-white/10 rounded-full cursor-pointer group mb-3 select-none"
                      onClick={handleProgressClick}
                      onMouseDown={handleProgressMouseDown}
                      onTouchMove={handleProgressTouch}
                      onTouchStart={handleProgressTouch}
                    >
                      {/* Buffered track */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/20 transition-all duration-300"
                        style={{ width: `${buffered}%` }}
                      />
                      {/* Played track */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-neonCyan transition-none"
                        style={{ width: `${progress}%`, boxShadow: '0 0 6px #00f0ff' }}
                      />
                      {/* Thumb dot */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-neonCyan opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ left: `calc(${progress}% - 8px)`, boxShadow: '0 0 8px #00f0ff' }}
                      />
                    </div>

                    {/* ── Controls row ── */}
                    <div className="flex items-center justify-between gap-2 md:gap-3">
                      {/* Left controls */}
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        {/* Play/Pause */}
                        <button
                          onClick={togglePlay}
                          className="text-white hover:text-neonCyan transition-colors shrink-0"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying
                            ? <Pause className="w-5 h-5 md:w-6 md:h-6" />
                            : <Play className="w-5 h-5 md:w-6 md:h-6" />
                          }
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-1.5 group/vol shrink-0">
                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-neonCyan transition-colors"
                            title={isMuted ? 'Unmute' : 'Mute'}
                          >
                            {isMuted || volume === 0
                              ? <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                              : <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                            }
                          </button>
                          {/* Volume slider — hidden on small screens, shown md+ */}
                          <input
                            ref={volumeRef}
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="hidden md:block w-16 lg:w-20 h-1 accent-cyan-400 cursor-pointer"
                            title="Volume"
                          />
                        </div>

                        {/* Time display */}
                        <span className="text-white/60 font-mono text-[10px] md:text-xs tracking-wider select-none whitespace-nowrap">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={toggleFullscreen}
                          className="text-white hover:text-neonCyan transition-colors"
                          title="Toggle Fullscreen"
                        >
                          {isFullscreen
                            ? <Minimize className="w-4 h-4 md:w-5 md:h-5" />
                            : <Maximize className="w-4 h-4 md:w-5 md:h-5" />
                          }
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* ── Footer ────────────────────────────────────── */}
          <div className="px-4 py-2 border-t border-neonCyan/20 bg-deepBlue/40 font-mono text-[10px] text-gray-500 flex justify-between items-center shrink-0">
            <span>ENC: AES-256</span>
            <span className="text-neonCyan">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <span className="hidden md:block text-green-700">IP: {Math.floor(Math.random() * 255)}.XXX.XXX.XXX</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoPlayer;
