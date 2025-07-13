import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Music, ExternalLink, Volume2, VolumeX, Headphones, Shuffle, SkipForward, SkipBack } from 'lucide-react';

const BackgroundMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showMusicSection, setShowMusicSection] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playHistoryRef = useRef<number[]>([]);

  // Spotify playlist and profile URLs (fallback)
  const playlistUrl = "https://open.spotify.com/playlist/7iHMbiM2X2A07FFCob65A2?si=68180e235e96426f";
  const profileUrl = "https://open.spotify.com/user/8src0sutylxdo3ejg94gykr90";

  // Local music tracks - Updated with cleaned filenames
  const musicFiles = [
    `${import.meta.env.BASE_URL}music/The Scientist.mp3`,
    `${import.meta.env.BASE_URL}music/Somewhere Only We Know (Nightcore Dreams).mp3`,
    `${import.meta.env.BASE_URL}music/Kho Gaye Hum Kahan.mp3`,
    `${import.meta.env.BASE_URL}music/Memories.mp3`,
    `${import.meta.env.BASE_URL}music/Something Just Like This.mp3`,
    `${import.meta.env.BASE_URL}music/The Nights.mp3`,
    `${import.meta.env.BASE_URL}music/Dandelions.mp3`,
    `${import.meta.env.BASE_URL}music/Anyone.mp3`,
    `${import.meta.env.BASE_URL}music/Enchanted (Nightcore Version).mp3`,
    `${import.meta.env.BASE_URL}music/Night Changes.mp3`,
    `${import.meta.env.BASE_URL}music/a thousand years.mp3`,
    `${import.meta.env.BASE_URL}music/Rewrite The Stars (with James Arthur & Anne-Marie).mp3`,
    `${import.meta.env.BASE_URL}music/Little Do You Know.mp3`,
    `${import.meta.env.BASE_URL}music/Love Me Like You Do.mp3`,
    `${import.meta.env.BASE_URL}music/Hold On.mp3`,
    `${import.meta.env.BASE_URL}music/Story of My Life.mp3`,
    `${import.meta.env.BASE_URL}music/Perfect.mp3`,
    `${import.meta.env.BASE_URL}music/Treat You Better.mp3`,
    `${import.meta.env.BASE_URL}music/Dancing With Your Ghost.mp3`,
    `${import.meta.env.BASE_URL}music/If the World Was Ending (feat. Julia Michaels).mp3`,
    `${import.meta.env.BASE_URL}music/Supermarket Flowers.mp3`,
    `${import.meta.env.BASE_URL}music/See You Again (feat. Charlie Puth).mp3`,
    `${import.meta.env.BASE_URL}music/Wolves.mp3`,
    `${import.meta.env.BASE_URL}music/Hall of Fame (feat. will.i.am).mp3`,
    `${import.meta.env.BASE_URL}music/Rewrite The Stars.mp3`,
    `${import.meta.env.BASE_URL}music/Demons.mp3`,
    `${import.meta.env.BASE_URL}music/lovely (with Khalid).mp3`,
    `${import.meta.env.BASE_URL}music/Castle on the Hill.mp3`,
    `${import.meta.env.BASE_URL}music/drivers license.mp3`,
    `${import.meta.env.BASE_URL}music/Eenie Meenie.mp3`,
    `${import.meta.env.BASE_URL}music/Fight Song.mp3`,
    `${import.meta.env.BASE_URL}music/Yellow.mp3`,
    `${import.meta.env.BASE_URL}music/Viva La Vida.mp3`,
    `${import.meta.env.BASE_URL}music/Thunder.mp3`,
    `${import.meta.env.BASE_URL}music/Sweet but Psycho.mp3`,
    `${import.meta.env.BASE_URL}music/Shape of You.mp3`,
    `${import.meta.env.BASE_URL}music/Señorita.mp3`,
    `${import.meta.env.BASE_URL}music/Rockabye (feat. Sean Paul & Anne-Marie).mp3`,
    `${import.meta.env.BASE_URL}music/Older.mp3`,
    `${import.meta.env.BASE_URL}music/Natural.mp3`,
    `${import.meta.env.BASE_URL}music/Monody.mp3`,
    `${import.meta.env.BASE_URL}music/Kings & Queens.mp3`,
    `${import.meta.env.BASE_URL}music/In The Stars.mp3`,
    `${import.meta.env.BASE_URL}music/I Want It That Way.mp3`,
    `${import.meta.env.BASE_URL}music/I Don't Care.mp3`,
    `${import.meta.env.BASE_URL}music/Hymn for the Weekend.mp3`,
    `${import.meta.env.BASE_URL}music/Hey, Soul Sister.mp3`,
    `${import.meta.env.BASE_URL}music/Girls Like You (feat. Cardi B) - Cardi B Version.mp3`,
    `${import.meta.env.BASE_URL}music/Ghost.mp3`,
    `${import.meta.env.BASE_URL}music/Galway Girl.mp3`,
    `${import.meta.env.BASE_URL}music/Fix You.mp3`,
    `${import.meta.env.BASE_URL}music/Faded.mp3`,
    `${import.meta.env.BASE_URL}music/Darkside.mp3`,
    `${import.meta.env.BASE_URL}music/Cheap Thrills.mp3`,
    `${import.meta.env.BASE_URL}music/Believer.mp3`,
    `${import.meta.env.BASE_URL}music/Baby.mp3`,
    `${import.meta.env.BASE_URL}music/Alone.mp3`,
  ];

  // Secret key combination to show/hide controls (Ctrl + M)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        setShowControls(prev => !prev);
      }
      // Double tap Ctrl to show/hide the actual player
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        setShowPlayer(prev => !prev);
      }
      // Ctrl + H to show/hide music section
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        setShowMusicSection(prev => !prev);
      }
      // Escape key to close music section
      if (event.key === 'Escape' && showMusicSection) {
        event.preventDefault();
        setShowMusicSection(false);
        setShowPlaylist(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMusicSection]);

  // Handle audio events with optimized performance
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      // Play next track when current one ends (like Spotify)
      setTimeout(() => {
        const nextTrack = isShuffled 
          ? Math.floor(Math.random() * musicFiles.length)
          : (currentTrack + 1) % musicFiles.length;
        setCurrentTrack(nextTrack);
        const audio = audioRef.current;
        if (audio) {
          audio.src = musicFiles[nextTrack];
          audio.volume = isMuted ? 0 : volume;
          audio.play().catch(() => {
            // If immediate play fails, try next track
            setTimeout(() => {
              const nextNextTrack = isShuffled 
                ? Math.floor(Math.random() * musicFiles.length)
                : (nextTrack + 1) % musicFiles.length;
              setCurrentTrack(nextNextTrack);
              audio.src = musicFiles[nextNextTrack];
              audio.play();
            }, 100);
          });
        }
      }, 50);
    };

    const handleError = () => {
      console.log('Audio playback failed, trying next track');
      setIsLoading(false);
      setTimeout(() => {
        const nextTrack = isShuffled 
          ? Math.floor(Math.random() * musicFiles.length)
          : (currentTrack + 1) % musicFiles.length;
        setCurrentTrack(nextTrack);
        const audio = audioRef.current;
        if (audio) {
          audio.src = musicFiles[nextTrack];
          audio.volume = isMuted ? 0 : volume;
          audio.play().catch(() => {
            // If immediate play fails, try next track
            setTimeout(() => {
              const nextNextTrack = isShuffled 
                ? Math.floor(Math.random() * musicFiles.length)
                : (nextTrack + 1) % musicFiles.length;
              setCurrentTrack(nextNextTrack);
              audio.src = musicFiles[nextNextTrack];
              audio.play();
            }, 100);
          });
        }
      }, 50);
    };

    const handleLoadedData = () => {
      // Audio loaded successfully
      audio.volume = isMuted ? 0 : volume;
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      // Only show loading for initial loads, not track switches
      if (!isPlaying) {
        setIsLoading(true);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [volume, isMuted, isPlaying, isShuffled, currentTrack, musicFiles.length]);

  const getNextTrack = useCallback(() => {
    if (isShuffled) {
      return Math.floor(Math.random() * musicFiles.length);
    }
    // Standard sequential playback - go to next track
    return (currentTrack + 1) % musicFiles.length;
  }, [isShuffled, currentTrack, musicFiles.length]);

  const playTrack = useCallback((trackIndex: number) => {
    const audio = audioRef.current;
    if (!audio || trackIndex >= musicFiles.length) {
      // If no local tracks available, fallback to Spotify
      openSpotifyFallback();
      return;
    }

    try {
      // Add current track to history before changing
      if (isPlaying && currentTrack !== trackIndex) {
        playHistoryRef.current.push(currentTrack);
        // Keep only last 10 tracks in history
        if (playHistoryRef.current.length > 10) {
          playHistoryRef.current.shift();
        }
      }

      // Show loading only for initial play, not track switches
      const wasPlaying = isPlaying;
      if (!wasPlaying) {
        setIsLoading(true);
      }

      // Pause current audio to stop any buffering
      audio.pause();
      
      // Set the new source
      audio.src = musicFiles[trackIndex];
      audio.volume = isMuted ? 0 : volume;
      
      // Immediate playback with minimal delay
      setTimeout(() => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.log('Audio playback failed:', error);
              setIsLoading(false);
              // If local audio fails, try next track or fallback
              setTimeout(() => {
                const nextTrack = getNextTrack();
                setCurrentTrack(nextTrack);
                playTrack(nextTrack);
              }, 100);
            });
        }
      }, 30); // Reduced delay for faster switching
    } catch (error) {
      console.log('Audio playback failed:', error);
      setIsLoading(false);
      setTimeout(() => {
        const nextTrack = getNextTrack();
        setCurrentTrack(nextTrack);
        playTrack(nextTrack);
      }, 100);
    }
  }, [musicFiles, isMuted, volume, isPlaying, currentTrack, getNextTrack]);

  const playNextTrack = useCallback(() => {
    const nextTrack = getNextTrack();
    setCurrentTrack(nextTrack);
    
    // Immediate track switch with optimized loading
    const audio = audioRef.current;
    if (audio) {
      // Pause current audio to stop any buffering
      audio.pause();
      
      // Set new source and immediately try to play
      audio.src = musicFiles[nextTrack];
      audio.volume = isMuted ? 0 : volume;
      
      // Use a small delay to ensure the source is set before playing
      setTimeout(() => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.log('Next track playback failed:', error);
              setIsLoading(false);
              // If immediate play fails, try the fallback method
              playTrack(nextTrack);
            });
        }
      }, 50);
    } else {
      playTrack(nextTrack);
    }
  }, [getNextTrack, playTrack, musicFiles, isMuted, volume]);

  const playPreviousTrack = useCallback(() => {
    let targetTrack: number;
    
    if (playHistoryRef.current.length > 0) {
      // If we have history, go back to the previous track in history
      targetTrack = playHistoryRef.current.pop() || 0;
    } else {
      // If no history, go to previous track in sequence (like Spotify)
      targetTrack = currentTrack > 0 ? currentTrack - 1 : musicFiles.length - 1;
    }
    
    setCurrentTrack(targetTrack);
    
    // Immediate track switch with optimized loading
    const audio = audioRef.current;
    if (audio) {
      // Pause current audio to stop any buffering
      audio.pause();
      
      // Set new source and immediately try to play
      audio.src = musicFiles[targetTrack];
      audio.volume = isMuted ? 0 : volume;
      
      // Use a small delay to ensure the source is set before playing
      setTimeout(() => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch((error) => {
              console.log('Previous track playback failed:', error);
              setIsLoading(false);
              // If immediate play fails, try the fallback method
              playTrack(targetTrack);
            });
        }
      }, 50);
    } else {
      playTrack(targetTrack);
    }
  }, [currentTrack, musicFiles.length, playTrack, musicFiles, isMuted, volume]);

  const playRandomSong = useCallback(() => {
    if (musicFiles.length > 0) {
      // If music is already playing, just resume the current track
      if (isPlaying) {
        const audio = audioRef.current;
        if (audio && audio.paused) {
          audio.play();
        }
        return;
      }
      
      // Start with a random track (like Spotify shuffle)
      const trackIndex = Math.floor(Math.random() * musicFiles.length);
      setCurrentTrack(trackIndex);
      playTrack(trackIndex);
    } else {
      openSpotifyFallback();
    }
  }, [musicFiles.length, isPlaying, playTrack]);

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      // If music is playing, pause it
      if (audio && !audio.paused) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // If music is paused, resume it
        if (audio && audio.paused) {
          audio.play();
          setIsPlaying(true);
        }
      }
    } else {
      // If no music is playing, check if there's a current track loaded
      if (audio && audio.src && audio.src !== '') {
        // Resume the current track
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // If resume fails, start a new track
          playRandomSong();
        });
      } else {
        // If no track is loaded, start playing
        playRandomSong();
      }
    }
  }, [isPlaying, playRandomSong]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isMuted) {
        audio.volume = volume;
        setIsMuted(false);
      } else {
        audio.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    const audio = audioRef.current;
    if (audio && !isMuted) {
      audio.volume = newVolume;
    }
  }, [isMuted]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  const openSpotifyFallback = useCallback(() => {
    // Fallback to Spotify if local files fail
    window.open(playlistUrl, '_blank');
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  }, [playlistUrl]);

  const openSpotifyPlaylist = useCallback(() => {
    window.open(playlistUrl, '_blank');
  }, [playlistUrl]);

  const openSpotifyApp = useCallback(() => {
    const spotifyAppUrl = `spotify:playlist:7iHMbiM2X2A07FFCob65A2`;
    const fallbackUrl = playlistUrl;
    
    window.location.href = spotifyAppUrl;
    
    setTimeout(() => {
      window.open(fallbackUrl, '_blank');
    }, 1000);
  }, [playlistUrl]);

  const copyPlaylistLink = useCallback(() => {
    navigator.clipboard.writeText(playlistUrl).then(() => {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500/90 backdrop-blur-md border border-green-400/30 rounded-lg px-4 py-2 animate-fade-in text-white text-sm';
      notification.textContent = 'Playlist link copied to clipboard!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 2000);
    });
  }, [playlistUrl]);

  const openProfile = useCallback(() => {
    window.open(profileUrl, '_blank');
  }, [profileUrl]);

  const getCurrentTrackName = useCallback(() => {
    if (musicFiles.length === 0) return 'No local tracks';
    const trackPath = musicFiles[currentTrack];
    const fileName = trackPath.split('/').pop() || '';
    // Remove the .mp3 extension
    return fileName.replace('.mp3', '') || 'Unknown Track';
  }, [musicFiles, currentTrack]);

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Preload multiple tracks for instant switching */}
      {musicFiles.length > 0 && (
        <>
          <audio
            preload="auto"
            style={{ display: 'none' }}
            src={musicFiles[(currentTrack + 1) % musicFiles.length]}
          />
          <audio
            preload="auto"
            style={{ display: 'none' }}
            src={musicFiles[currentTrack > 0 ? currentTrack - 1 : musicFiles.length - 1]}
          />
        </>
      )}

      {/* Full Music Section - Accessible to all users */}
      {showMusicSection && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMusicSection(false);
              setShowPlaylist(false);
            }
          }}
        >
          <div className="bg-card/90 backdrop-blur-md border border-neon-blue/30 rounded-xl p-4 max-w-lg w-full max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neon-blue">🎵 My Music</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm px-2 py-1 rounded border border-purple-400/30"
                >
                  {showPlaylist ? 'Hide List' : 'Show List'}
                </button>
                <button
                  onClick={() => setShowMusicSection(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl hover:bg-gray-700/50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">

              {musicFiles.length > 0 ? (
                <>
                  <button
                    onClick={togglePlay}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-neon-blue/20 to-purple-600/20 hover:from-neon-blue/30 hover:to-purple-600/30 text-neon-blue px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 border border-neon-blue/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-neon-blue/20"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <Pause size={24} />
                    ) : (
                      <Play size={24} />
                    )}
                    <span className="font-semibold text-lg">
                      {isLoading ? 'Loading...' : isPlaying ? 'Pause Music' : 'Play'}
                    </span>
                  </button>

                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-4 text-center border border-gray-600/30 shadow-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {isPlaying ? (
                        <>
                          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                          <p className="text-neon-blue text-sm font-semibold">Now Playing</p>
                          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm font-semibold">Current Track</p>
                      )}
                    </div>
                    <p className="text-gray-200 text-sm font-medium">{getCurrentTrackName()}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={playPreviousTrack}
                      disabled={isLoading}
                      className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600/30 hover:border-gray-500/50"
                    >
                      <SkipBack size={18} />
                      <span className="font-medium">Previous</span>
                    </button>
                    <button
                      onClick={toggleShuffle}
                      disabled={isLoading}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border ${
                        isShuffled 
                          ? 'bg-purple-600/30 text-purple-400 border-purple-600/50 shadow-lg shadow-purple-600/20' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border-gray-600/30 hover:border-gray-500/50'
                      }`}
                    >
                      <Shuffle size={18} />
                      <span className="font-medium">Shuffle</span>
                    </button>
                    <button
                      onClick={playNextTrack}
                      disabled={isLoading}
                      className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600/30 hover:border-gray-500/50"
                    >
                      <SkipForward size={18} />
                      <span className="font-medium">Next</span>
                    </button>
                  </div>

                  {/* Playlist Browser */}
                  {showPlaylist && (
                    <div className="border-t border-gray-700 pt-4 animate-fade-in">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-neon-blue font-semibold text-sm">Current Playlist ({musicFiles.length} tracks)</h3>
                        <button
                          onClick={() => setShowPlaylist(false)}
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          ×
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                        {musicFiles.map((track, index) => {
                          const trackName = track.split('/').pop()?.replace('.mp3', '') || 'Unknown Track';
                          const isCurrentTrack = index === currentTrack;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setCurrentTrack(index);
                                const audio = audioRef.current;
                                if (audio) {
                                  audio.pause();
                                  audio.src = track;
                                  audio.volume = isMuted ? 0 : volume;
                                  audio.play().then(() => {
                                    setIsPlaying(true);
                                    setIsLoading(false);
                                  }).catch(() => {
                                    playTrack(index);
                                  });
                                } else {
                                  playTrack(index);
                                }
                              }}
                              disabled={isLoading}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isCurrentTrack 
                                  ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' 
                                  : 'bg-gray-700/30 hover:bg-gray-600/30 text-gray-300'
                              }`}
                            >
                              {isCurrentTrack ? (
                                <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                              ) : (
                                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              )}
                              <span className="text-xs font-mono text-gray-400 w-6">{(index + 1).toString().padStart(2, '0')}</span>
                              <span className="text-sm truncate">{trackName}</span>
                              {isCurrentTrack && isPlaying && (
                                <div className="ml-auto">
                                  <div className="w-1 h-1 bg-neon-blue rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 text-sm py-4">
                  <p>No local music files found.</p>
                  <p className="text-xs mt-2">Upload your music files to enable background playback.</p>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-xs mb-3 text-center">Or use Spotify:</p>
                
                <button
                  onClick={openSpotifyPlaylist}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Open in Spotify Web
                </button>

                <button
                  onClick={openSpotifyApp}
                  className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-neon-blue/30 mb-2"
                >
                  <Headphones size={20} />
                  Open in Spotify App
                </button>

                <button
                  onClick={copyPlaylistLink}
                  className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={20} />
                  Copy Playlist Link
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={openProfile}
                  className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-purple-600/30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  My Profile
                </button>
              </div>
            </div>

            <div className="mt-4 text-center border-t border-gray-700 pt-4">
              <p className="text-xs text-gray-400">
                Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl + H</kbd> to toggle • 
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Esc</kbd> to close • 
                Click outside to close
              </p>
            </div>
          </div>
        </div>
      )}

            {/* Spotify Player - Hidden by default, can be toggled */}
      {showPlayer && (
        <div className="fixed bottom-24 left-6 z-50 bg-black/90 backdrop-blur-md border border-neon-blue/30 rounded-xl p-2 animate-fade-in w-64">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <h3 className="text-neon-blue font-semibold text-xs">Music</h3>
              <button
                onClick={toggleShuffle}
                className={`transition-colors duration-200 ${isShuffled ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
                title={isShuffled ? "Shuffle On" : "Shuffle Off"}
              >
                <Shuffle size={10} />
              </button>
            </div>
            <button
              onClick={() => setShowPlayer(false)}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ×
            </button>
          </div>
          
          {musicFiles.length > 0 ? (
            <>
              {/* Compact track info */}
              <div className="bg-gray-800/30 rounded-lg p-1.5 mb-2 border border-gray-600/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-neon-blue/20 to-purple-600/20 rounded flex items-center justify-center border border-neon-blue/30">
                    <Music size={10} className="text-neon-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{getCurrentTrackName()}</p>
                  </div>
                  {isPlaying && (
                    <div className="flex items-center gap-0.5">
                      <div className="w-0.5 h-0.5 bg-neon-blue rounded-full animate-pulse"></div>
                      <div className="w-0.5 h-0.5 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Centered play controls */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <button
                  onClick={playPreviousTrack}
                  disabled={isLoading}
                  className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 p-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <SkipBack size={10} />
                </button>
                
                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue p-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause size={12} />
                  ) : (
                    <Play size={12} />
                  )}
                </button>
                
                <button
                  onClick={playNextTrack}
                  disabled={isLoading}
                  className="bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 p-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next"
                >
                  <SkipForward size={10} />
                </button>
              </div>

              {/* Compact volume control */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="text-neon-blue hover:text-white transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 h-0.5 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </>
          ) : (
            <button
              onClick={openSpotifyPlaylist}
              className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue px-2 py-1.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 text-xs"
            >
              <Play size={12} />
              Open Spotify Playlist
            </button>
          )}
        </div>
      )}

      {/* Secret Music Controls */}
      {showControls && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-md border border-neon-blue/30 rounded-full px-4 py-2 animate-fade-in">
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-neon-blue hover:text-white'
            }`}
            title={isLoading ? "Loading..." : isPlaying ? "Pause Music" : "Play"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>
          
          <div className="w-px h-6 bg-neon-blue/30"></div>
          
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="text-neon-blue hover:text-white transition-colors duration-200"
            title="Toggle Player"
          >
            <Music size={20} />
          </button>
          
          <button
            onClick={() => setShowMusicSection(true)}
            className="text-green-400 hover:text-white transition-colors duration-200"
            title="Music Section"
          >
            <Headphones size={20} />
          </button>
          
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-white transition-colors duration-200"
            title="My Spotify Profile"
            onClick={(e) => {
              e.preventDefault();
              openProfile();
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-green-400"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
        </div>
      )}

      {/* Secret indicator (subtle hint) */}
      <div className="fixed bottom-4 right-4 z-40 opacity-20 hover:opacity-40 transition-opacity duration-300">
        <div className="text-xs text-gray-400 font-mono">
          Ctrl+M
        </div>
      </div>


    </>
  );
};

export default BackgroundMusicPlayer; 