import React, { Component } from "react";
import * as speechCommands from '@tensorflow-models/speech-commands';
import Speech from 'speak-tts'
import './AudioClassifier.css'

class AudioClassifier extends Component {
    constructor(props) {
        super(props);
        this.state = { label: ''};
    }

    async componentDidMount() {

        const threshold = 0.90;
        
        const URL = "http://teachablemachine.withgoogle.com/models/aYxJTa5Kj/";
    
        const checkpointURL = "https://storage.googleapis.com/tm-model/aYxJTa5Kj/model.json";
        const metadataURL = "https://storage.googleapis.com/tm-model/aYxJTa5Kj/metadata.json";
      
        const recognizer = speechCommands.create(
            "BROWSER_FFT",
            undefined,
            checkpointURL,
            metadataURL);
      
        await recognizer.ensureModelLoaded();
    
        const classLabels = recognizer.wordLabels(); // get class labels
    
        
        recognizer.listen(result => {
            for (let i = 0; i < classLabels.length; i++) {
              if(result.scores[i].toFixed(2) > threshold)
              {
                const classPrediction = classLabels[i];
                // const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
                this.setState({label: classPrediction});
                const speech = new Speech() 
                if (classLabels[i] === 'Doorbell'){
                  speech.speak({
                    text: 'I heard a doorbell!',
                    }).then(() => {
                        console.log("Success !")
                    }).catch(e => {
                        console.error("An error occurred :", e)
                  })
                }
                
              }
            }
        }, {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.50
        });
      }

    render() {
        return (
            <div className="audio-class">
                <div class="waveWrapper waveAnimation">
                    <div class="waveWrapperInner bgTop">
                      <div class="wave waveTop" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-top.png')`}}></div>
                    </div>
                    <div class="waveWrapperInner bgMiddle">
                      <div class="wave waveMiddle" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-mid.png')`}}></div>
                    </div>
                    <div class="waveWrapperInner bgBottom">
                    <div class="wave waveBottom" style={{backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-bot.png')`}}></div>
                    </div>
                </div>
                <h1 className="label">{this.state.label}</h1>;
            </div>
        )
    }
}

export default AudioClassifier;