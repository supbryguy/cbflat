/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  X, 
  Home, 
  Coffee, 
  Bed, 
  Utensils, 
  Tv, 
  Bath,
  Maximize2,
  MapPin,
  Instagram,
  Lock,
  Unlock,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  acquired?: string;
  image?: string;
  customIcon?: string;
  iconWidth?: number;
  iconHeight?: number;
  zoomLevel?: number; // Zoom level in viewBox units (default is 100)
}

interface Room {
  id: string;
  name: string;
  path: string;
  description: string;
  hotspots: Hotspot[];
  labelX: number;
  labelY: number;
  bounds: { x: number; y: number; width: number; height: number };
}

const ROOMS: Room[] = [
  {
    id: 'master-bedroom',
    name: 'Master Bedroom',
    path: 'M 180 0 H 0 V 250 H 278 V 188 H 180 Z',
    description: 'the cool bay window was a huge reason why we picked this flat, but we haven\'t really found a use for that spot',
    labelX: 90,
    labelY: 125,
    bounds: { x: 0, y: 0, width: 278, height: 250 },
    hotspots: [
      {
        id: 'bunny',
        x: 30,
        y: 125,
        title: 'bunny',
        description: 'comes in a pair, really old',
        acquired: 'Arizona, 1999',
        zoomLevel: 250,
        image: '/hotspotsphotos/sexinmice.jpg',
        customIcon: '/hotspots/bunny.png',
        iconWidth: 45,
        iconHeight: 45,
        
      }
    ]
  },
  {
    id: 'study',
    name: 'Study',
    path: 'M 180 0 H 348 V 189 H 180 Z',
    description: 'most of bry\'s nerdy shit lives here',
    labelX: 264,
    labelY: 95,
    bounds: { x: 180, y: 0, width: 168, height: 189 },
    hotspots: [
      {
        id: 'keyboard',
        x: 305,
        y: 35,
        title: 'IBM Model M',
        description: 'the clickiest clicky spring bucklin\' keeberd ',
        acquired: 'ebay, 2022',
        image: '/hotspotsphotos/keyboard.jpg',
        customIcon: '/hotspots/keyboard.png',
        iconWidth: 45,
        iconHeight: 45,
        zoomLevel: 250
      },
      {
        id: 'ball',
        x: 200,
        y: 120,
        title: 'felt ball',
        description: 'bry made this ball out of felt to practice making a real leather ball, one day...',
        acquired: 'Singapore, 2025',
        image: '/hotspotsphotos/keyboard.jpg',
        customIcon: '/hotspots/ball.png',
        iconWidth: 25,
        iconHeight: 25,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'craft-room',
    name: 'Craft Room',
    path: 'M 348 0 H 525 V 189 H 348 Z',
    description: 'we like making things, and we plan to make this room to make things',
    labelX: 435,
    labelY: 95,
    bounds: { x: 348, y: 0, width: 177, height: 189 },
    hotspots: [
      {
        id: 'sexin-mice',
        x: 405,
        y: 95,
        title: 'sexin mice',
        description: '2 mice and their 2 child',
        acquired: 'Singapore, 2025',
        image: '/hotspotsphotos/sexinmice.jpg',
        customIcon: '/hotspots/sexinmice.png',
        iconWidth: 45,
        iconHeight: 45,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'living-room',
    name: 'Living Room',
    path: 'M 525 59 H 730 V 536 H 576 V 379 H 524 V 250 H 278 V 188 H 525 Z',
    description: 'we ended up spending the most of our free time watching tv here. who would\'ve thought',
    labelX: 650,
    labelY: 297,
    bounds: { x: 278, y: 59, width: 452, height: 477 },
    hotspots: [
      {
        id: 'sus',
        x: 500,
        y: 220,
        title: 'amongus',
        description: 'hanging in the vents, sus af',
        acquired: 'Korea, 2024',
        image: '/hotspotsphotos/amongus.jpg',
        customIcon: '/hotspots/amongus.png',
        iconWidth: 35,
        iconHeight: 35,
        zoomLevel: 250
      },
      {
        id: 'floor-mat',
        x: 575,
        y: 130,
        title: 'Mat, the floormat',
        description: 'designed by miyoshi rug, he lays around, occupies the living room not doing much really',
        acquired: 'Stacked Store, 2025',
        image: '/hotspotsphotos/mat.jpg',
        customIcon: '/hotspots/mat.png',
        iconWidth: 40,
        iconHeight: 70,
        zoomLevel: 250
      },
      {
        id: 'espresso machine',
        x: 560,
        y: 320,
        title: 'Lelit Mara X v2',
        description: 'the first big ticket purchase bryan made that charity approves',
        acquired: 'Cowpresso, 2023',
        image: '/hotspotsphotos/coffee.jpg',
        customIcon: '/hotspots/coffee.png',
        iconWidth: 40,
        iconHeight: 40,
        zoomLevel: 250
      },
      {
        id: 'basket',
        x: 700,
        y: 440,
        title: 'shopping basket of socks',
        description: 'charity wanted to steal baskets from shengsiong',
        acquired: 'Taobao, 2026',
        image: '/hotspotsphotos/basket.jpg',
        customIcon: '/hotspots/basket.png',
        iconWidth: 40,
        iconHeight: 40,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'master-toilet',
    name: 'Master Toilet',
    path: 'M 157 250 H 286 V 365 H 157 Z',
    description: 'its green and its clean ',
    labelX: 221,
    labelY: 307,
    bounds: { x: 157, y: 250, width: 129, height: 115 },
    hotspots: [
      {
        id: 'toothbrush',
        x: 240,
        y: 290,
        title: 'toothbrush',
        description: 'Keeping the master toilet smelling like a spa.',
        acquired: 'Singapore, 2026',
        image: 'https://picsum.photos/seed/candle/400/300',
        customIcon: '/hotspots/toothbrush.png',
        iconWidth: 45,
        iconHeight: 45,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'common-toilet',
    name: 'Common Toilet',
    path: 'M 286 250 H 392 V 365 H 286 Z',
    description: 'its red, you can hear people pee from the service yard sometimes',
    labelX: 339,
    labelY: 307,
    bounds: { x: 286, y: 250, width: 106, height: 115 },
    hotspots: [
      {
        id: 'toilet-pp',
        x: 360,
        y: 330,
        title: 'dikku-san figurine',
        description: 'this small pp found its way in the common toilet',
        acquired: 'mightyjaxx, 2018',
        image: '/hotspotsphotos/pp.jpg',
        customIcon: '/hotspots/pp.png',
        iconWidth: 30,
        iconHeight: 30,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'store',
    name: 'Store',
    path: 'M 393 250 H 524 V 379 H 393 Z',
    description: 'look in here last',
    labelX: 458,
    labelY: 314,
    bounds: { x: 393, y: 250, width: 131, height: 129 },
    hotspots: [
      {
        id: 'standees',
        x: 458,
        y: 314,
        title: 'Standees',
        description: 'hey you found us good job',
        acquired: 'our wedding, 2023',
        image: 'https://picsum.photos/seed/storage/400/300',
        customIcon: '/hotspots/us.png',
        iconWidth: 45,
        iconHeight: 60,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'service-yard',
    name: 'Service Yard',
    path: 'M 311 365 H 393 V 536 H 311 Z',
    description: 'charity\'s plant home. and also where we do our laundry',
    labelX: 352,
    labelY: 450,
    bounds: { x: 311, y: 365, width: 82, height: 171 },
    hotspots: [
      {
        id: 'pink-dino',
        x: 350,
        y: 415,
        title: 'joguman magnet',
        description: 'he hangs around charity\'s plants ',
        acquired: 'Korea, 2023',
        image: '/hotspotsphotos/pinkdino.jpg',
        customIcon: '/hotspots/pinkdino.png',
        iconWidth: 25,
        iconHeight: 35,
        zoomLevel: 250
      }
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    path: 'M 393 379 H 576 V 536 H 393 Z',
    description: 'spot the misaligned backsplash. lowkey bothered but we don\'t stare at it all the time',
    labelX: 484,
    labelY: 457,
    bounds: { x: 393, y: 379, width: 183, height: 157 },
    hotspots: [
      {
        id: 'sushi',
        x: 410,
        y: 420,
        title: 'sushi LA figurine',
        description: 'cause sushi belongs in the fridge',
        acquired: 'Kuala Lumpur, 2025',
        image: '/hotspotsphotos/sushi.jpg',
        customIcon: '/hotspots/sushi.png',
        iconWidth: 30,
        iconHeight: 30,
        zoomLevel: 250
      },
      {
        id: 'troopers',
        x: 560,
        y: 460,
        title: 'tiny stormtroopers',
        description: 'they do be guardin the main door',
        acquired: 'Singapore, 2015',
        image: '/hotspotsphotos/troopers.jpg',
        customIcon: '/hotspots/troopers.png',
        iconWidth: 45,
        iconHeight: 45,
        zoomLevel: 250
      }
    ]
  }
];

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cbflat_unlocked') === 'true';
    }
    return false;
  });
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  // Pre-load all hotspot images and icons for instant appearance
  useEffect(() => {
    const imagesToPreload = ROOMS.flatMap(room => 
      room.hotspots.flatMap(spot => [spot.image, spot.customIcon].filter(Boolean) as string[])
    );
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Keyboard shortcut to lock the website (Cmd/Ctrl + U) or trigger congrats (Cmd/Ctrl + G)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + U to lock
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        handleReset();
      }
      
      // Cmd/Ctrl + G to trigger congrats
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setShowCongrats(true);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#8CC63F', '#000000', '#FFFFFF'],
          zIndex: 1000
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passcode.toLowerCase() === 'thecbflat') {
      setIsUnlocked(true);
      localStorage.setItem('cbflat_unlocked', 'true');
      setError(false);
    } else {
      setError(true);
      setPasscode('');
      // Shake animation trigger or just visual feedback
      setTimeout(() => setError(false), 500);
    }
  };

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [discoveredHotspots, setDiscoveredHotspots] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cbflat_discovered');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse discovered hotspots', e);
        }
      }
    }
    return new Set();
  });
  const [showCongrats, setShowCongrats] = useState(false);

  const totalHotspots = ROOMS.reduce((acc, room) => acc + room.hotspots.length, 0);

  const handleReset = () => {
    setIsUnlocked(false);
    localStorage.removeItem('cbflat_unlocked');
    localStorage.removeItem('cbflat_discovered');
    setPasscode('');
    setSelectedRoom(null);
    setActiveHotspot(null);
    setDiscoveredHotspots(new Set());
  };

  // Long press logic for title reset
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const LONG_PRESS_DURATION = 5000;

  const startLongPress = () => {
    setLongPressProgress(0);
    const startTime = Date.now();
    
    // Update progress bar
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / LONG_PRESS_DURATION) * 100, 100);
      setLongPressProgress(progress);
      if (progress >= 100 && progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }, 50);

    longPressTimer.current = setTimeout(() => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      handleReset();
      setLongPressProgress(0);
    }, LONG_PRESS_DURATION);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setLongPressProgress(0);
  };

  // Calculate dynamic bounds for the floorplan to make it perfectly responsive
  const floorplanBounds = useMemo(() => {
    const minX = Math.min(...ROOMS.map(r => r.bounds.x));
    const minY = Math.min(...ROOMS.map(r => r.bounds.y));
    const maxX = Math.max(...ROOMS.map(r => r.bounds.x + r.bounds.width));
    const maxY = Math.max(...ROOMS.map(r => r.bounds.y + r.bounds.height));
    const padding = 60; // Consistent padding around the content
    return {
      x: minX - padding,
      y: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2
    };
  }, []);

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setActiveHotspot(null);
  };

  const handleHotspotClick = (spot: Hotspot, event?: React.MouseEvent) => {
    setActiveHotspot(spot);
    // Find room that contains this hotspot
    const room = ROOMS.find(r => r.hotspots.some(s => s.id === spot.id));
    if (room) {
      setSelectedRoom(room);
    }
    
    if (!discoveredHotspots.has(spot.id)) {
      let origin = { x: 0.5, y: 0.6 };

      // Try to get position from event first
      if (event) {
        origin = {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight
        };
      } else {
        // Fallback: try to find the element by ID
        const element = document.getElementById(`hotspot-marker-${spot.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          origin = {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
          };
        }
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin,
        colors: ['#8CC63F', '#000000', '#FFFFFF'],
        zIndex: 1000
      });
      const newDiscovered = new Set(discoveredHotspots);
      newDiscovered.add(spot.id);
      setDiscoveredHotspots(newDiscovered);
      localStorage.setItem('cbflat_discovered', JSON.stringify(Array.from(newDiscovered)));
      
      if (newDiscovered.size === totalHotspots) {
        setTimeout(() => setShowCongrats(true), 800);
      }
    }
  };

  const closeZoom = () => {
    setSelectedRoom(null);
    setActiveHotspot(null);
  };

  return (
    <div 
      className="h-screen font-sans text-stone-900 selection:bg-pink-200 flex flex-col overflow-hidden relative"
      style={{ 
        background: '#fff6e6',
        backgroundImage: 'linear-gradient(180deg, #fff6e6 0%, #ffe7ba 100%)'
      }}
    >
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#fff6e6] p-6"
            style={{ 
              backgroundImage: 'linear-gradient(180deg, #fff6e6 0%, #ffe7ba 100%)'
            }}
          >
            <div className="max-w-md w-full space-y-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center">
                  <Lock size={40} className="text-white" />
                </div>
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-7xl font-display font-black leading-none">
                  THIS PAGE IS LOCKED
                </h1>
                <p className="text-stone-600 font-medium leading-tight">
                  Please ask for the passcode upon entering the CB flat.
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-6">
                <motion.div
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    autoFocus
                    className={`w-full bg-white border-4 border-black rounded-2xl px-6 py-5 text-2xl font-bold text-center placeholder:text-stone-300 focus:outline-none focus:ring-4 focus:ring-black/5 transition-all ${
                      error ? 'border-red-500 text-red-500' : 'border-black'
                    }`}
                  />
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-black text-white py-5 rounded-2xl text-xl font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all"
                >
                  Unlock <ChevronRight size={24} />
                </motion.button>
              </form>

              <p className="text-xs font-display uppercase tracking-widest text-stone-400 pt-8 leading-none">
                DO NOT SHARE THE PASSCODE
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col flex-1"
          >
            {/* Film Grain Filter Definition */}
      <svg style={{ display: 'none' }}>
        <filter id="film-grain">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="4" 
            stitchTiles="stitch" 
          />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="2" intercept="-0.5" />
            <feFuncG type="linear" slope="2" intercept="-0.5" />
            <feFuncB type="linear" slope="2" intercept="-0.5" />
          </feComponentTransfer>
        </filter>
      </svg>
      
      {/* Film Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.3]"
        style={{ filter: 'url(#film-grain)' }}
      />

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12 w-full px-4 md:px-12 lg:px-24 relative z-10 py-6 md:py-12 lg:py-24 overflow-hidden lg:overflow-visible">
        {/* Title Section */}
        <div className="lg:col-span-1 flex flex-col justify-between lg:h-full order-1 flex-shrink-0">
          <div className="relative group">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl lg:text-[12rem] font-display font-bold leading-none text-center lg:text-left mb-4 lg:mb-0 cursor-help select-none"
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
            >
              the cb flat
            </motion.h1>
            
            {/* Progress Bar for Long Press */}
            <AnimatePresence>
              {longPressProgress > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 h-2 bg-black rounded-full overflow-hidden"
                  style={{ width: '100%' }}
                >
                  <motion.div 
                    className="h-full bg-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${longPressProgress}%` }}
                    transition={{ ease: "linear", duration: 0.05 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Desktop Description & Socials (Bottom Left) */}
          <div className="hidden lg:flex flex-col space-y-8 mt-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-md"
            >
              <p className="text-xl lg:text-2xl font-medium leading-snug text-stone-800">
                WELCOME TO <span className="font-bold text-black uppercase">CHARITY and BRYAN'S</span> HOUSE.<br/>Tap into the floorplan to begin your expedition. Study and find all the hidden artifacts, and see if you can log all our favorite things
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold flex gap-4"
            >
              <a href="https://www.instagram.com/sourpoo" target="_blank" rel="noopener noreferrer" className="hover:underline">@sourpoo</a>
              <a href="https://www.instagram.com/bryanyuth" target="_blank" rel="noopener noreferrer" className="hover:underline">@bryanyuth</a>
            </motion.div>
          </div>
        </div>

        {/* Floorplan Section */}
        <div className="lg:col-span-2 order-2 flex items-center justify-center flex-1 min-h-0 lg:h-full">
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-visible"
            style={{ 
              aspectRatio: `${floorplanBounds.width} / ${floorplanBounds.height}` 
            }}
          >
            <svg 
              viewBox={`${floorplanBounds.x} ${floorplanBounds.y} ${floorplanBounds.width} ${floorplanBounds.height}`}
              className="w-full h-full max-h-full overflow-visible"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="hand-drawn">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="solid-grey">
                  <feColorMatrix type="matrix" values="0 0 0 0 0.376 0 0 0 0 0.376 0 0 0 0 0.376 0 0 0 1 0" />
                </filter>
              </defs>
              <g filter="url(#hand-drawn)">
                {ROOMS.map((room) => (
                  <motion.path
                    key={room.id}
                    layoutId={`room-${room.id}`}
                    d={room.path}
                    className={`cursor-pointer transition-all duration-300 stroke-black stroke-[4px] ${
                      selectedRoom?.id === room.id 
                        ? 'fill-[#E5E5E5] stroke-[8px]' 
                        : hoveredRoom?.id === room.id
                        ? 'fill-[#F5F5F5] stroke-[6px]'
                        : 'fill-[#FFFFFF]'
                    }`}
                    style={{
                      filter: hoveredRoom?.id === room.id ? 'url(#glow)' : 'none'
                    }}
                    whileHover={{ 
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                    animate={hoveredRoom?.id === room.id ? {
                      opacity: [0.9, 1, 0.9],
                    } : {}}
                    transition={hoveredRoom?.id === room.id ? {
                      opacity: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                    } : {}}
                    onHoverStart={() => setHoveredRoom(room)}
                    onHoverEnd={() => setHoveredRoom(null)}
                    onClick={() => handleRoomClick(room)}
                  />
                ))}
              </g>

              {/* Hotspots */}
              <AnimatePresence>
                {ROOMS.flatMap(room => room.hotspots).map((spot) => {
                  const isDiscovered = discoveredHotspots.has(spot.id);
                  return (
                    <motion.g
                      key={spot.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="pointer-events-none"
                    >
                      <g>
                        {spot.customIcon ? (
                          <>
                            <image
                              href={spot.customIcon}
                              x={spot.x - (spot.iconWidth ? spot.iconWidth * 1.2 : 30)}
                              y={spot.y - (spot.iconHeight ? spot.iconHeight * 1.2 : 30)}
                              width={spot.iconWidth ? spot.iconWidth * 2.4 : 60}
                              height={spot.iconHeight ? spot.iconHeight * 2.4 : 60}
                              preserveAspectRatio="xMidYMid meet"
                            />
                            <motion.image
                              href={spot.customIcon}
                              x={spot.x - (spot.iconWidth ? spot.iconWidth * 1.2 : 30)}
                              y={spot.y - (spot.iconHeight ? spot.iconHeight * 1.2 : 30)}
                              width={spot.iconWidth ? spot.iconWidth * 2.4 : 60}
                              height={spot.iconHeight ? spot.iconHeight * 2.4 : 60}
                              preserveAspectRatio="xMidYMid meet"
                              style={{ filter: 'url(#solid-grey)' }}
                              initial={false}
                              animate={{ opacity: isDiscovered ? 0 : 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          </>
                        ) : (
                          <>
                            <g>
                              <circle
                                cx={spot.x}
                                cy={spot.y}
                                r="12"
                                className="fill-[#FFFFFF] stroke-black/20 stroke-1"
                              />
                              <path
                                d="M 0,-6 L 1.5,-2 L 6,-1.5 L 2.5,1.5 L 3.5,6 L 0,4 L -3.5,6 L -2.5,1.5 L -6,-1.5 L -1.5,-2 Z"
                                transform={`translate(${spot.x}, ${spot.y})`}
                                className="fill-black"
                              />
                            </g>
                            <motion.g
                              style={{ filter: 'url(#solid-grey)' }}
                              initial={false}
                              animate={{ opacity: isDiscovered ? 0 : 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <circle
                                cx={spot.x}
                                cy={spot.y}
                                r="12"
                                className="fill-[#FFFFFF] stroke-black/20 stroke-1"
                              />
                              <path
                                d="M 0,-6 L 1.5,-2 L 6,-1.5 L 2.5,1.5 L 3.5,6 L 0,4 L -3.5,6 L -2.5,1.5 L -6,-1.5 L -1.5,-2 Z"
                                transform={`translate(${spot.x}, ${spot.y})`}
                                className="fill-black"
                              />
                            </motion.g>
                          </>
                        )}
                      </g>
                    </motion.g>
                  );
                })}
              </AnimatePresence>
            </svg>
          </div>
        </div>

        {/* Mobile Description & Socials (Below Floorplan) */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-4 py-4 order-3 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <p className="text-base md:text-lg font-medium leading-snug text-stone-800">
              WELCOME TO <span className="font-bold text-black uppercase">CHARITY and BRYAN'S</span> HOUSE.<br/>Tap into the floorplan to begin your expedition. Study the local furniture, uncover hidden artifacts, and see if you can log all our favorite things. 
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg font-bold flex gap-4"
          >
            <a href="https://www.instagram.com/sourpoo" target="_blank" rel="noopener noreferrer" className="hover:underline">@sourpoo</a>
            <a href="https://www.instagram.com/bryanyuth" target="_blank" rel="noopener noreferrer" className="hover:underline">@bryanyuth</a>
          </motion.div>
        </div>
      </main>

      {/* Modals - Rendered at the root level for maximum reliability */}
      <AnimatePresence mode="sync">
        {selectedRoom && (
          <ZoomModal 
            key="zoom-modal-wrapper"
            room={selectedRoom} 
            onClose={closeZoom} 
            onHotspotClick={handleHotspotClick}
            discoveredHotspots={discoveredHotspots}
            activeHotspot={activeHotspot}
            onActiveHotspotChange={setActiveHotspot}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {showCongrats && (
          <CongratsModal 
            key="congrats-modal-wrapper"
            onClose={() => setShowCongrats(false)} 
          />
        )}
      </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Congrats Modal Component
const CongratsModal = ({ onClose }: { onClose: () => void, key?: React.Key }) => {
  React.useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 20, opacity: 0 }}
        className="bg-[#fff6e6] rounded-[3rem] p-12 max-w-lg w-full text-center space-y-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        style={{ 
          backgroundImage: 'linear-gradient(180deg, #fff6e6 0%, #ffe7ba 100%)'
        }}
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-black">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.2, 1, 1.2, 1]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MapPin size={48} className="text-black" />
            </motion.div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-black leading-none uppercase italic">
            CONGRATS
          </h2>
          <p className="text-xl font-medium text-stone-900 leading-snug">
            You've successfully discovered all the hidden hotspots in the house. <br />You're a true CB!
          </p>
        </div>

        <motion.button 
          onClick={onClose}
          whileTap={{ scale: 0.95 }}
          className="w-full py-6 bg-black text-white rounded-2xl text-2xl font-black hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)]"
        >
          Awesome!
        </motion.button>
      </motion.div>
    </motion.div>
  );
};



// Zoom Modal Component to handle isolated room view
const ZoomModal = ({ 
  room, 
  onClose, 
  onHotspotClick, 
  discoveredHotspots,
  activeHotspot,
  onActiveHotspotChange
}: { 
  room: Room, 
  onClose: () => void, 
  onHotspotClick: (spot: Hotspot, event?: React.MouseEvent) => void, 
  discoveredHotspots: Set<string>,
  activeHotspot: Hotspot | null,
  onActiveHotspotChange: (spot: Hotspot | null) => void,
  key?: React.Key 
}) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [scrollStatus, setScrollStatus] = React.useState({
    isAtTop: true,
    isAtBottom: false,
    isScrollable: false
  });
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Check screen size
    const mql = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);

    // Check initial scrollability
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setScrollStatus(prev => ({
        ...prev,
        isScrollable: scrollHeight > clientHeight,
        isAtBottom: scrollHeight <= clientHeight
      }));
    }

    return () => { 
      document.body.style.overflow = 'unset';
      mql.removeEventListener('change', handler);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtTop = scrollTop < 10;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
    const isScrollable = scrollHeight > clientHeight;
    
    setScrollStatus({ isAtTop, isAtBottom, isScrollable });
  };

  const getFadeClass = () => {
    if (!scrollStatus.isScrollable) return '';
    if (scrollStatus.isAtTop && !scrollStatus.isAtBottom) return 'scroll-fade-bottom';
    if (!scrollStatus.isAtTop && scrollStatus.isAtBottom) return 'scroll-fade-top';
    if (!scrollStatus.isAtTop && !scrollStatus.isAtBottom) return 'scroll-fade-both';
    return '';
  };

  const zoomViewBox = React.useMemo(() => {
    if (!activeHotspot) {
      return `${room.bounds.x - 40} ${room.bounds.y - 40} ${room.bounds.width + 80} ${room.bounds.height + 80}`;
    }

    // Base zoom size from hotspot or default
    // We use the zoomLevel as a target width
    const zoomW = activeHotspot.zoomLevel || 100;
    const zoomH = zoomW; // Keep it square for the viewBox base

    // Center on hotspot - No clamping to room bounds to ensure it's ALWAYS in the center
    const vx = activeHotspot.x - zoomW / 2;
    const vy = activeHotspot.y - zoomH / 2;

    return `${vx} ${vy} ${zoomW} ${zoomH}`;
  }, [activeHotspot, room]);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: isMobile ? 'blur(0px)' : 'blur(24px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)', pointerEvents: 'none' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-8 bg-stone-950/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="md:rounded-[4rem] w-full max-w-7xl overflow-hidden relative h-full md:h-[90vh] lg:h-[85vh] pointer-events-auto flex flex-col lg:flex-row"
        style={{ 
          background: '#fff6e6',
          backgroundImage: 'linear-gradient(180deg, #fff6e6 0%, #ffe7ba 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Isolated Shape View - Zoomed */}
        <div className="relative h-[40vh] lg:h-full lg:flex-1 overflow-visible z-0">
          <motion.div
            className="w-full h-full"
          >
            <motion.svg 
              initial={{ viewBox: `${room.bounds.x - 40} ${room.bounds.y - 40} ${room.bounds.width + 80} ${room.bounds.height + 80}` }}
              animate={{ viewBox: zoomViewBox }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <g filter="url(#hand-drawn)">
                <path
                  d={room.path}
                  className="fill-[#FFFFFF] stroke-black stroke-[8px]"
                  style={{ opacity: activeHotspot ? 0.3 : 1, transition: 'opacity 0.5s ease' }}
                />
              </g>
              
              {/* Hotspots in zoomed view */}
              {room.hotspots.map((spot) => {
                const isDiscovered = discoveredHotspots.has(spot.id);
                const isSelected = activeHotspot?.id === spot.id;
                
                return (
                  <motion.g
                    key={`zoom-spot-${spot.id}`}
                    id={`hotspot-marker-${spot.id}`}
                    className="cursor-pointer"
                    onClick={(e) => onHotspotClick(spot, e)}
                    animate={{ 
                      scale: isSelected ? 1.5 : 1,
                      opacity: activeHotspot && !isSelected ? 0.2 : 1
                    }}
                    whileHover={{ scale: isSelected ? 1.6 : 1.25 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <g>
                      {spot.customIcon ? (
                        <>
                          <image
                            href={spot.customIcon}
                            x={spot.x - (spot.iconWidth ? spot.iconWidth * 1.2 : 30)}
                            y={spot.y - (spot.iconHeight ? spot.iconHeight * 1.2 : 30)}
                            width={spot.iconWidth ? spot.iconWidth * 2.4 : 60}
                            height={spot.iconHeight ? spot.iconHeight * 2.4 : 60}
                            preserveAspectRatio="xMidYMid meet"
                          />
                          <motion.image
                            href={spot.customIcon}
                            x={spot.x - (spot.iconWidth ? spot.iconWidth * 1.2 : 30)}
                            y={spot.y - (spot.iconHeight ? spot.iconHeight * 1.2 : 30)}
                            width={spot.iconWidth ? spot.iconWidth * 2.4 : 60}
                            height={spot.iconHeight ? spot.iconHeight * 2.4 : 60}
                            preserveAspectRatio="xMidYMid meet"
                            style={{ filter: 'url(#solid-grey)' }}
                            initial={false}
                            animate={{ opacity: isDiscovered ? 0 : 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        </>
                      ) : (
                        <>
                          <g>
                            <circle
                              cx={spot.x}
                              cy={spot.y}
                              r="12"
                              className="fill-[#FFFFFF] stroke-black/20 stroke-1"
                            />
                            <path
                              d="M 0,-6 L 1.5,-2 L 6,-1.5 L 2.5,1.5 L 3.5,6 L 0,4 L -3.5,6 L -2.5,1.5 L -6,-1.5 L -1.5,-2 Z"
                              transform={`translate(${spot.x}, ${spot.y})`}
                              className="fill-black"
                            />
                          </g>
                          <motion.g
                            style={{ filter: 'url(#solid-grey)' }}
                            initial={false}
                            animate={{ opacity: isDiscovered ? 0 : 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <circle
                              cx={spot.x}
                              cy={spot.y}
                              r="12"
                              className="fill-[#FFFFFF] stroke-black/20 stroke-1"
                            />
                            <path
                              d="M 0,-6 L 1.5,-2 L 6,-1.5 L 2.5,1.5 L 3.5,6 L 0,4 L -3.5,6 L -2.5,1.5 L -6,-1.5 L -1.5,-2 Z"
                              transform={`translate(${spot.x}, ${spot.y})`}
                              className="fill-black"
                            />
                          </motion.g>
                        </>
                      )}
                    </g>
                  </motion.g>
                );
              })}
            </motion.svg>
          </motion.div>
        </div>

        {/* Details Panel */}
        <div className="flex-1 w-full lg:w-[400px] xl:w-[500px] bg-white/40 lg:backdrop-blur-lg border-t lg:border-t-0 lg:border-l border-white/20 relative z-10 lg:h-full shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {!activeHotspot ? (
              <motion.div
                key="room-details"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex-1 flex flex-col h-full p-8 lg:p-16"
              >
                <div 
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className={`overflow-y-auto pr-4 custom-scrollbar flex-1 min-h-0 ${getFadeClass()}`}
                >
                  <div className="mb-8 md:mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h2 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold leading-[0.9] mb-4 md:mb-6">
                        {room.name}
                      </h2>
                      <div className="h-2 w-24 bg-black rounded-full" />
                    </motion.div>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-xl lg:text-2xl text-stone-900 leading-snug mb-8 md:mb-12 font-medium"
                  >
                    {room.description}
                  </motion.p>

                  {room.hotspots.length > 0 ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-5">
                        {room.hotspots.map((spot) => {
                          const isDiscovered = discoveredHotspots.has(spot.id);
                          return (
                            <motion.button
                              key={`list-spot-${spot.id}`}
                              onClick={(e) => onHotspotClick(spot, e)}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[2rem] border-2 transition-all text-left group ${
                                isDiscovered 
                                  ? 'border-black hover:bg-stone-50' 
                                  : 'border-dashed border-black/20 grayscale'
                              }`}
                            >
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform ${
                                isDiscovered ? 'bg-black' : 'bg-stone-900'
                              }`}>
                                <MapPin size={24} className="text-white" />
                              </div>
                              <div>
                                <p className="font-black text-stone-900 text-lg md:text-xl">
                                  {isDiscovered ? spot.title : '???'}
                                </p>
                                <p className="text-xs md:text-sm text-stone-400 font-medium line-clamp-1 leading-tight">
                                  {isDiscovered ? (spot.acquired ? `Acquired from ${spot.acquired}` : spot.description) : 'Click to discover'}
                                </p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 rounded-[3rem] bg-stone-50 border-2 border-dashed border-stone-100 text-center">
                      <p className="text-stone-300 font-bold italic text-lg">No specific highlights yet.</p>
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 md:mt-12 w-full py-4 md:py-6 bg-black text-white rounded-[2rem] text-base md:text-xl font-black hover:bg-stone-900 transition-all flex items-center justify-center gap-4 hover:translate-y-[-4px]"
                >
                  <Home size={24} />
                  Back to Floorplan
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="hotspot-details"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex-1 flex flex-col h-full p-8 lg:p-16"
              >
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-row lg:flex-col gap-6 md:gap-8">
                  <div className="relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border-4 border-black aspect-square bg-stone-100 flex items-center justify-center shrink-0 w-1/3 lg:w-full">
                    {activeHotspot.image ? (
                      <img 
                        src={activeHotspot.image} 
                        alt={activeHotspot.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <MapPin size={64} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-none">
                      {activeHotspot.title}
                    </h3>
                    <div className="h-1.5 w-16 bg-black rounded-full" />
                    
                    <p className="text-sm md:text-lg lg:text-xl text-stone-700 leading-snug font-medium">
                      {activeHotspot.description}
                    </p>

                    {activeHotspot.acquired && (
                      <div className="pt-4 flex items-center gap-3 text-stone-400 italic">
                        <MapPin size={16} />
                        <span className="text-sm">Acquired from {activeHotspot.acquired}</span>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => onActiveHotspotChange(null)}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 md:mt-12 w-full py-4 md:py-6 bg-stone-100 text-black border-2 border-black rounded-[2rem] text-base md:text-xl font-black hover:bg-stone-200 transition-all flex items-center justify-center gap-4 hover:translate-y-[-4px]"
                >
                  <ArrowLeft size={24} />
                  Back to {room.name}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
