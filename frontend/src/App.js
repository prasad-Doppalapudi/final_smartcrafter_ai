import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import Solutions from './components/Solutions';
import SpeechToTextPage from './components/SpeechToTextPage.js';
import TextToSpeechPage from './components/TextToSpeechPage.js';
import DetachAudioPage from './components/DetachAudioPage.js';
import TryItSection from './components/PricingSection';
import CommitmentSection from './components/CommitmentSection';
import Layout from './components/Layout';
import './components/App.css';
import SignupForm from './components/SignupForm.js';
import LoginForm from './components/LoginForm.js';
import TryItPage from './components/TryItPage.js';
import ContentGenerator from './components/ContentGenerator.js';
import GenerateImage from './components/generate_image';
import GenerateLogo from './components/generate_logo';
import ShortsLanguageConverter from './components/ShortsLanguageConverter';
import GenerateVideo from './components/generatevideo';
import EditImage from './components/image_variant';
import ProductExplanationVideo from './components/ProductExplanationVideo'; // Import the new component

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <Layout>
          <Routes>
            <Route
              path='/'
              element={
                <div>
                  <WelcomeSection />
                  <div id="solutions-section">
                    <Solutions />
                  </div>
                  <ProductExplanationVideo />
                  <CommitmentSection />
                  <TryItSection redirectToSignup={'signupform'} />
                </div>
              }
            />
            <Route
              path='/solutions/speech-to-text'
              element={<SpeechToTextPage />}
            />
            <Route
              path='/solutions/text-to-speech'
              element={<TextToSpeechPage />}
            />
            <Route
              path='/solutions/detach-audio'
              element={<DetachAudioPage />}
            />
            <Route path='/signupform' element={<SignupForm />} />
            <Route path='/loginform' element={<LoginForm />} />
            <Route path='/tryitpage' element={<TryItPage />} />
            <Route path='/solutions/generate-content' element={<ContentGenerator />} />
            <Route path='/solutions/generate-image' element={<GenerateImage />} />
            <Route path='/solutions/generate-logo' element={<GenerateLogo />} />
            <Route path='/solutions/shorts-language-converter' element={<ShortsLanguageConverter />} />
            <Route path='/solutions/generate-video' element={<GenerateVideo />} />
            <Route path='/solutions/image-variant' element={<EditImage />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;
