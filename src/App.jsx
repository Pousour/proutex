import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import './App.css';

// Initialize OpenAI client
// IMPORTANT: Replace with your actual API key in a .env file (VITE_OPENAI_API_KEY)
// For security, this key should ideally be handled by a backend in a production app.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

const fetchAIStrategiesAPI = async (riskLevel) => {
  console.log(`Fetching REAL AI strategies for risk level: ${riskLevel}`);
  if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    console.warn("OpenAI API key not configured. Returning mock data.");
    return new Promise(resolve => setTimeout(() => resolve(["Mock AI: Configure API Key for real suggestions."]), 500));
  }

  let promptContent = "";
  if (riskLevel === 'High') {
    promptContent = "You are an AI assistant for Proutex, an app that helps manage flatulence. The user has indicated a 'High' risk of an audible or olfactory emission. Provide one concise, witty, and actionable avoidance strategy or coping mechanism. Keep it under 15 words.";
  } else if (riskLevel === 'Medium') {
    promptContent = "You are an AI assistant for Proutex, an app that helps manage flatulence. The user has indicated a 'Medium' risk of an audible or olfactory emission. Provide one concise, witty, and actionable avoidance strategy or coping mechanism. Keep it under 15 words.";
  } else { // Low
    promptContent = "You are an AI assistant for Proutex, an app that helps manage flatulence. The user has indicated a 'Low' risk (meaning things are calm). Provide one concise, witty, and reassuring or celebratory message. Keep it under 15 words.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptContent }],
      max_tokens: 30, // Adjusted for concise strategies
      n: 3, // Get a few options
    });
    const strategies = completion.choices.map(choice => `${choice.message.content.trim()}`);
    return strategies.length > 0 ? strategies : ["AI: Couldn't think of anything right now!"];
  } catch (error) {
    console.error("Error fetching AI strategies from OpenAI:", error);
    throw new Error("Failed to fetch strategies from AI.");
  }
};


function BlameGame() {
  const [currentScapegoat, setCurrentScapegoat] = useState('');
  const [isLoadingScapegoat, setIsLoadingScapegoat] = useState(false);
  const cardRef = useRef(null);

  const findScapegoat = async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
      console.warn("OpenAI API key not configured for Blame Game. Returning mock scapegoat.");
      setCurrentScapegoat("The cat did it (API key needed for more creativity!)");
      return;
    }
    setIsLoadingScapegoat(true);
    setCurrentScapegoat('');
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "You are an AI assistant for Proutex's 'Blame Game'. Generate a short, funny, and creative scapegoat or excuse for an unexpected sound or smell. Keep it under 12 words." }],
        max_tokens: 20,
      });
      const scapegoat = completion.choices[0]?.message?.content?.trim() || "The AI is speechless!";
      setCurrentScapegoat(scapegoat);
    } catch (error) {
      console.error("Error fetching scapegoat from OpenAI:", error);
      setCurrentScapegoat("AI is busy, blame the dog for now!");
    } finally {
      setIsLoadingScapegoat(false);
    }
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.remove('fade-in-card');
      void cardRef.current.offsetWidth;
      const timer = setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.classList.add('fade-in-card');
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div ref={cardRef} className="blame-game card">
      <h2>The Blame Game!</h2>
      <p>Need a quick excuse? We've got you covered for those... unexpected moments.</p>
      <button onClick={findScapegoat} disabled={isLoadingScapegoat}>
        {isLoadingScapegoat ? 'AI Thinking...' : 'Find a Scapegoat'}
      </button>
      {isLoadingScapegoat && <p className="loading-text small-loader">Finding the perfect excuse...</p>}
      {currentScapegoat && !isLoadingScapegoat && (
        <p className="scapegoat-reveal">
          <strong>Quick, blame:</strong> {currentScapegoat}
        </p>
      )}
    </div>
  );
}

function RiskAssessment({ currentRiskLevel, onRiskLevelChange }) {
  const riskLevels = ['Low', 'Medium', 'High'];

  return (
    <div className="risk-assessment card">
      <h2>Set Current Risk Level</h2>
      <p>Manually assess the situation and select the perceived risk.</p>
      <div className="risk-selector">
        {riskLevels.map((level) => (
          <button
            key={level}
            className={`risk-button ${level.toLowerCase()} ${currentRiskLevel === level ? 'selected' : ''}`}
            onClick={() => onRiskLevelChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
       <p className="selected-risk-display">Selected Risk: <strong className={`risk-text-${currentRiskLevel?.toLowerCase()}`}>{currentRiskLevel || 'None'}</strong></p>
    </div>
  );
}

function AvoidanceStrategies({ riskLevel, strategies, isLoading }) {
  return (
    <div className="avoidance-strategies card">
      <h2>AI-Powered Avoidance Strategies</h2>
      {isLoading && <p className="loading-text">🧠 Consulting AI for optimal strategies...</p>}
      {!isLoading && strategies.length === 0 && riskLevel && (
        <p>No specific AI strategies available for this level yet, but stay alert!</p>
      )}
      {!isLoading && strategies.length === 0 && !riskLevel && (
        <p>Select a risk level above to get AI-powered strategies.</p>
      )}
      {!isLoading && strategies.length > 0 && (
        <ul>
          {strategies.map((strategy, index) => (
            <li key={index}>{strategy}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SoundMasking() {
  const playlist = [
    { name: 'Ocean Waves', emoji: '🌊', url: '/audio/ocean.mp3' },
    { name: 'Busy Cafe Chatter', emoji: '☕', url: '/audio/cafe.mp3' },
    { name: 'White Noise Generator', emoji: '💨', url: '/audio/noise.mp3' },
    { name: 'Keyboard Typing Sounds', emoji: '⌨️', url: '/audio/keyboard.mp3'},
  ];
  const [currentSound, setCurrentSound] = useState(null);
  const audioRef = useRef(null);

  const playSound = (sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const newAudio = new Audio(sound.url);
    newAudio.play()
      .then(() => {
        audioRef.current = newAudio;
        setCurrentSound(sound);
      })
      .catch(error => {
        console.error(`Error playing sound "${sound.name}":`, error);
        if (audioRef.current === newAudio) {
          audioRef.current = null;
        }
        setCurrentSound(null);
      });
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setCurrentSound(null);
    }
  };

  const handleSuggestAndPlay = () => {
    if (playlist.length === 0) return;
    const randomIndex = Math.floor(Math.random() * playlist.length);
    playSound(playlist[randomIndex]);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="sound-masking card">
      <h2>Sound Masking</h2>
      <p>Need to cover something up? Pick a vibe or let us choose!</p>
      <div className="sound-controls">
        <button onClick={handleSuggestAndPlay}>Suggest & Play Random</button>
        {currentSound && (
          <button onClick={stopSound} className="stop-button">Stop Sound 🛑</button>
        )}
      </div>
      {currentSound && (
        <p className="sound-suggestion">
          <strong>Now Playing:</strong> {currentSound.name} {currentSound.emoji}
        </p>
      )}
      <h3>Available Sounds (click to play):</h3>
      <ul className="sound-list">
        {playlist.map((sound) => (
          <li 
            key={sound.url}
            onClick={() => playSound(sound)} 
            tabIndex="0" 
            role="button" 
            onKeyPress={(e) => e.key === 'Enter' && playSound(sound)}
            className={currentSound?.url === sound.url ? 'playing' : ''}
          >
            {sound.name} {sound.emoji}
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [riskLevel, setRiskLevel] = useState(null);
  const [proutexPoints, setProutexPoints] = useState(0);
  const [fade, setFade] = useState(false);
  const [strategies, setStrategies] = useState([]);
  const [isLoadingStrategies, setIsLoadingStrategies] = useState(false);

  const handleRiskLevelChange = (newLevel) => {
    setRiskLevel(newLevel);
    if (newLevel === 'High') {
      setProutexPoints(points => points + 15);
    } else if (newLevel === 'Medium') {
      setProutexPoints(points => points + 8);
    } else if (newLevel === 'Low') {
      setProutexPoints(points => points + 3);
    }
  };
  
  useEffect(() => {
    setFade(true);
    const initialCards = document.querySelectorAll('.card:not(.blame-game)');
    initialCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('fade-in-card');
      }, index * 150 + 50); 
    });
  }, []);

  useEffect(() => {
    if (riskLevel) {
      setIsLoadingStrategies(true);
      setStrategies([]);
      fetchAIStrategiesAPI(riskLevel)
        .then(fetchedStrategies => {
          setStrategies(fetchedStrategies);
        })
        .catch(error => {
          console.error("Error fetching AI strategies:", error);
          setStrategies(['Error: Could not load AI strategies. Check console.']);
        })
        .finally(() => {
          setIsLoadingStrategies(false);
        });
    } else {
      setStrategies([]);
    }
  }, [riskLevel]);


  return (
    <div className={`App ${fade ? 'fade-in-app' : ''}`}>
      <header className="App-header">
        <h1>Proutex 💨</h1>
        <p>Your Advanced Flatulence Management Co-Pilot.</p>
        <div className="proutex-points-display">
          Proutex Points: <strong>{proutexPoints}</strong> ✨
        </div>
      </header>
      <main>
        <RiskAssessment 
          currentRiskLevel={riskLevel} 
          onRiskLevelChange={handleRiskLevelChange} 
        />
        <AvoidanceStrategies 
          riskLevel={riskLevel} 
          strategies={strategies} 
          isLoading={isLoadingStrategies} 
        />
        <BlameGame /> {/* BlameGame is now always rendered */}
        <SoundMasking />
      </main>
      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Proutex Inc. All rights reserved (mostly).</p>
        <p><small>AI features powered by OpenAI. Please use responsibly.</small></p>
      </footer>
    </div>
  );
}

export default App;
