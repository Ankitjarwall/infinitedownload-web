/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Wishlist from '@/utils/Wishlist';
import MutePreference from '@/utils/MutePreference';

import EpisodeT from '@/types/Episode';
import MediaType from '@/types/MediaType';
import Movie from '@/types/Movie';
import Series from '@/types/Series';
import Continue from '@/types/Continue';
import Loading from './Loading';

import Card from './Card';
import Episode from './Episode';

interface TitleProps {
  type: string;
  id: string;
}

export default function Title({ type, id }: TitleProps) {
  const nav = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<Movie | Series>();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<EpisodeT[]>();
  const [maxEpisodes, setMaxEpisodes] = useState(1);

  const [wished, setWished] = useState(false);
  const [extendSuggestions, setExtendSuggestions] = useState(false);
  const [extendEpisodes, setExtendEpisodes] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(MutePreference.isMuted()); // Get the initial state from MutePreference
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Loading state updated code here
  const [loading, setLoading] = useState(true);

  function getYear(date: string) {
    const timestamp = Date.parse(date);
    return new Date(timestamp).getFullYear();
  }

  function getLength(runtime: number) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    if (!hours) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  async function getData() {
    const req = await fetch(import.meta.env.VITE_APP_API + '/' + type + '/' + id);
    const res = await req.json();

    if (!res.success) {
      nav('/');
      return;
    }

    const data = res.data;

    setData(data);

    // Loading state updated code here
    setLoading(false); // Set loading to false when data is fetched

    if (type !== 'series') return;

    const cont = localStorage.getItem('continue_' + id);

    if (!cont) {
      getEpisodes();
      return;
    }

    const parsed: Continue = JSON.parse(cont);

    setSeason(parsed.season);
    setEpisode(parsed.episode);

    getEpisodes(parsed.season);
  }

  async function getEpisodes(season: number = 1) {
    const req = await fetch(`${import.meta.env.VITE_APP_API}/episodes/${id}?s=${season}`);
    const res = await req.json();

    if (!res.success) {
      nav('/');
      return;
    }

    const data = res.data;

    setEpisodes(data);
    setMaxEpisodes(data.length);
  }

  function onSeasonChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setEpisodes(undefined);

    const s = parseInt(e.target.value);

    setSeason(s);
    getEpisodes(s);
  }
  

  async function fetchTrailer() {
    const endpoint = `${import.meta.env.VITE_AWS_API}/${type}/${id}`;
    const req = await fetch(endpoint);
    const res = await req.json();

    const trailers = res.results.filter(
      (trailer: any) => trailer.type.toLowerCase() === 'trailer' || trailer.name.toLowerCase().includes('Trailer', 'official')
    );

    if (trailers.length > 0) {
      const trailerKey = trailers[0].key;
      const youtubeUrl = `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&mute=${MutePreference.isMuted()}&playlist=${trailerKey}&enablejsapi=1`;

      setTrailerUrl(youtubeUrl);

    }  
  }
  

  function onPlusClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;
    if (type !== 'movie' && type !== 'series') return;

    Wishlist.add({ id: data.id, poster: data.images.poster, title: data.title, type });
  }

  function onCheckClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!data) return;

    Wishlist.remove(data.id, type as MediaType);
  }

  function onWindowClick(e: MouseEvent) {
    if (!ref.current) return;

    if (e.target === ref.current) {
      nav('/');
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    window.addEventListener('click', onWindowClick);

    return () => {
      document.body.style.overflow = 'auto';

      window.removeEventListener('click', onWindowClick);
    };
  }, []);

  useEffect(() => {
    if (isNaN(parseInt(id))) {
      return nav('/');
    }

    if (type !== 'movie' && type !== 'series') {
      return nav('/');
    }

    setData(undefined);
    setEpisodes(undefined);
    fetchTrailer();
    setExtendEpisodes(false);
    setExtendSuggestions(false);

    // Loading state updated code here
    setLoading(true); // Set loading to true when fetching data

    getData();

    return () => {
      setData(undefined);
    };
  }, [type, id]);

  useEffect(() => {
    if (!data) return;

    setWished(Wishlist.has(data.id, type as MediaType));

    function onWishlistChange() {
      if (!data) return;

      setWished(Wishlist.has(data.id, type as MediaType));
    }

    Wishlist.on(data.id, type, onWishlistChange);

    return () => {
      Wishlist.off(data.id, type, onWishlistChange);
    };
  }, [data]);

  useEffect(() => {
    const iframe = videoRef.current;
    if (iframe) {
      const player = iframe.contentWindow;
      if (player && typeof player.postMessage === 'function') {
        const command = isMuted ? 'mute' : 'unMute';
        player.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
          }),
          '*'
        );
      }
    }
  }, [isMuted]);


  // Listen for changes to the mute preference
  useEffect(() => {

    const handleMuteChange = () => {
      setIsMuted(MutePreference.isMuted());
    };

    MutePreference.onMuteChange(handleMuteChange);

    return () => {
      MutePreference.offMuteChange(handleMuteChange);
    };
  }, []);

  // Loading state updated code here
  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <div className="title" ref={ref}></div>;
  }

  function getDownloadUrl_2() {
    let url = type === 'movie'
      ? `${import.meta.env.VITE_MOIVE_DOWNLOAD_2}/movie/${id}`
      : `${import.meta.env.VITE_MOIVE_DOWNLOAD_2}/tv/${id}/${season}/${episode}`;
    return url;
  }

  // Function to full screen the video
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter fullscreen mode logic
      const iframe = videoRef.current;
      if (iframe && iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
    } else {
      // Exit fullscreen mode logic
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  // Function to toggle mute state
  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState); // Update local state

    // Update YouTube video mute state
    const iframe = videoRef.current;
    if (iframe) {
      const player = iframe.contentWindow;
      if (player && typeof player.postMessage === 'function') {
        const command = newMuteState ? 'mute' : 'unMute';
        player.postMessage(
          JSON.stringify({
            event: 'command',
            func: command,
          }),
          '*'
        );
      }
    }

    MutePreference.setMute(newMuteState); // Save the new mute state to storage
  };


  return (
    <>
      <Helmet>
        <title>
          {data.title} - {import.meta.env.VITE_APP_NAME}
        </title>
      </Helmet>

      <div className="title" ref={ref}>
        <div className="title-container">
          <div className="title-close" onClick={() => nav('/')}>
            <i className="fa-light fa-close"></i>
          </div>
          <div className="title-backdrop" style={{ position: 'relative' }}>
            {trailerUrl ? ( // Conditionally render trailer if URL is available
              <iframe
                src={trailerUrl}
                ref={videoRef} // Add ref to access the iframe element
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen" // Add fullscreen permission
                allowFullScreen // This is required for YouTube videos to support fullscreen
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundImage: `url(${data.images.backdrop})`,
                  backgroundSize: 'cover'
                }}
              ></iframe>
            ) : (
              <div
                className="title-backdrop"
                style={{ backgroundImage: `url(${data.images.backdrop})` }}
              ></div>
            )}
          </div>


          <div className="title-content">
            <div className="title-logo">
              <img alt={data.title} src={data.images.logo} />
            </div>

            <div className="left-side-buttons">
              <button className="button" onClick={toggleMute}>
                <i className={`fa-solid ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
              </button>

              <button className="button btn" onClick={toggleFullScreen}>
                <i className="fa-solid fa-expand"></i>
              </button>
            </div>

            <div className="title-actions">
              <Link className="button" to={`/watch/${id}${type === 'series' ? `?s=${season}&e=${episode}` : ''}`}>
                <i className="fa-solid fa-play"></i>
                <span>{type === 'series' ? `S${season} E${episode}` : 'Play'}</span>
              </Link>

              {wished ? (
                <button className="button" onClick={onCheckClick}>
                  <i className="fa-solid fa-check"></i>
                </button>
              ) : (
                <button className="button secondary" onClick={onPlusClick}>
                  <i className="fa-solid fa-plus"></i>
                </button>
              )}
              <div className="button2">
                <a href={getDownloadUrl_2()} target="_blank" rel="noopener noreferrer">
                  <i className="fa-solid fa-download"></i>
                  <span>{type === 'series' ? `S${season} E${episode}` : 'Download'}</span>
                </a>
              </div>
            </div>

            <div className="title-grid">
              <div className="title-col">
                {data.tagline && <h4 className="title-tagline">{data.tagline}</h4>}

                <div className="title-meta">
                  <span className="title-rating">{data.rating}%</span>

                  <span>{getYear(data.date)}</span>

                  {'runtime' in data && <span>{getLength(data.runtime)}</span>}

                  {'seasons' in data && <span>{data.seasons} Seasons</span>}
                </div>

                <p className="title-description">{data.description}</p>
              </div>

              <div className="title-col">
                <div className="title-list">
                  <span className="head">Genres:</span>
                  {data.genres.map((genre, i) => (
                    <Link to={`/genre/${type}/${genre.id}`} key={i}>
                      {genre.name}
                      {i < data.genres.length - 1 && ','}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {'seasons' in data && (
              <div className="title-section">
                <div className="title-row">
                  <h3>Episodes</h3>

                  <select className="title-select" defaultValue={season} onChange={onSeasonChange}>
                    {Array.from({ length: data.seasons }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        Season {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="title-episodes">
                  {episodes &&
                    episodes.map((episode, i) => {
                      if (!extendEpisodes && i > 9) return null;

                      return <Episode key={i} {...episode} id={data.id} season={season} maxEpisodes={maxEpisodes} />;
                    })}
                </div>

                {episodes && episodes.length > 10 && (
                  <div className={`title-extend ${extendEpisodes ? 'active' : ''}`}>
                    <button className="button secondary" onClick={() => setExtendEpisodes(!extendEpisodes)}>
                      {extendEpisodes ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {data.suggested.length > 0 && (
              <div className="title-section">
                <h3>More Like This</h3>

                <div className="title-cards">
                  {data.suggested.map((media, i) => {
                    if (!extendSuggestions && i > 7) return null;

                    return <Card key={i} {...media} />;
                  })}
                </div>

                {data.suggested.length > 8 && (
                  <div className={`title-extend ${extendSuggestions ? 'active' : ''}`}>
                    <button className="button secondary" onClick={() => setExtendSuggestions(!extendSuggestions)}>
                      {extendSuggestions ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}