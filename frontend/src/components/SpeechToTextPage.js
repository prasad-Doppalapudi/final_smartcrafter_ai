import React, { useState } from 'react';
import './SpeechToTextPage.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';

const SpeechToTextPage = () => {
  const [transcribedText, setTranscribedText] = useState('');
  const [fileToConvert, setFileToConvert] = useState(null);
  const selectedLanguage = 'en-US'; // Language is now a fixed value

  const handleAudioUpload = event => {
    const file = event.target.files[0];
    setFileToConvert(file);
  };

  const handleConvert = async () => {
    if (fileToConvert) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        const GOOGLE_API_KEY = 'AIzaSyA1Zr5_O35gtqHXn8lGnGD6L2_hWarSvsE';

        try {
          const response = await axios.post(
            `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
            {
              config: {
                encoding: 'MP3',
                sampleRateHertz: 44100,
                languageCode: selectedLanguage
              },
              audio: {
                content: base64Audio
              }
            }
          );

          if (response.data.results && response.data.results.length > 0) {
            setTranscribedText(
              response.data.results[0].alternatives[0].transcript
            );
          } else {
            console.log(
              'No transcription results in the API response:',
              response.data
            );
            setTranscribedText('No transcription available');
          }
        } catch (error) {
          console.error(
            'Error with Google Speech-to-Text API:',
            error.response ? error.response.data : error.message
          );
        }
      };

      reader.readAsDataURL(fileToConvert);
    } else {
      console.error('No file selected.');
    }
  };

  const downloadAsTxt = () => {
    const blob = new Blob([transcribedText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'transcription.txt');
  };

  const downloadAsPdf = () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const lines = doc.splitTextToSize(transcribedText, 180);
    let y = 10;
  
    lines.forEach((line, index) => {
      if (y > pageHeight - 10) {
        doc.addPage();
        y = 10; // Reset y to top of the new page
      }
      doc.text(line, 10, y);
      y += 10; // Increment y position for next line
    });
  
    doc.save('transcription.pdf');
  };
  

  const downloadAsDocx = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph(transcribedText),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'transcription.docx');
  };

  return (
    <div className='speech-to-text-page'>
      <h2>Speech To Text</h2>
      <div className='upload-section'>
        <label htmlFor='audioFile'>Upload the audio file:</label>
        <input
          type='file'
          id='audioFile'
          accept='audio/mp3'
          onChange={handleAudioUpload}
          className='file-upload'
        />
        <button className='convert-button' onClick={handleConvert}>
          Convert to Text
        </button>
      </div>
      <div className='transcribed-text'>
        {transcribedText && (
          <div>
            <h3>Transcribed Text:</h3>
            <div className='converted-text-box'>
              <p>{transcribedText}</p>
            </div>
            <div className='download-buttons'>
              <button onClick={downloadAsTxt}>Download as TXT</button>
              <button onClick={downloadAsPdf}>Download as PDF</button>
              <button onClick={downloadAsDocx}>Download as DOCX</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechToTextPage;