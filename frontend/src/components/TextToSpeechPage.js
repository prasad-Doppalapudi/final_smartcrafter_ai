import React, { useState } from 'react';
import './TextToSpeechPage.css';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';

GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.mjs';
const TextToSpeechPage = () => {
  const [selectedText, setSelectedText] = useState('');
  const [convertedAudio, setConvertedAudio] = useState(null);

  const handleTextUpload = async event => {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const fileSizeLimit = 5 * 1024 * 1024; // 5 MB
    if (file.size > fileSizeLimit) {
      alert('File size exceeds 5 MB limit. Please select a smaller file.');
      return;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension === 'txt') {
      const text = await file.text();
      setSelectedText(text);
    } else if (fileExtension === 'pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ');
        }
        //   console.log("Extracted Text from PDF:", text); // Log the extracted text
        setSelectedText(text);
      } catch (error) {
        console.error('Error loading PDF document:', error);
      }
    } else if (fileExtension === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setSelectedText(result.value);
    } else {
      alert(
        'Unsupported file format. Please upload a .txt, .pdf, or .docx file.',
      );
    }
  };

  const convertToAudio = async () => {
    if (!selectedText) {
      alert('No text to convert to audio.');
      return;
    }
    const languageCode = 'en-US'; // Default language code
    const apiKey = 'AIzaSyA1Zr5_O35gtqHXn8lGnGD6L2_hWarSvsE';

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: selectedText },
            voice: { languageCode },
            audioConfig: { audioEncoding: 'LINEAR16' },
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to convert text to audio');
      }

      const data = await response.json();
      setConvertedAudio(`data:audio/wav;base64,${data.audioContent}`);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  return (
    <div className="text-to-speech-page">
      <h2>Text To Speech</h2>
      <div className="upload-section">
        <label htmlFor="textFile">Upload the text file:</label>
        <input
          type="file"
          id="textFile"
          accept=".txt,.pdf,.docx"
          onChange={handleTextUpload}
        />
        <button onClick={convertToAudio}>Convert to Audio</button>
      </div>
      <div className="converted-audio">
        {convertedAudio && (
          <div className="converted-audio-box">
            <h3 className="converted-audio-heading">Converted Audio:</h3>
            <audio className="converted-audio-player" controls>
              <source src={convertedAudio} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeechPage;
