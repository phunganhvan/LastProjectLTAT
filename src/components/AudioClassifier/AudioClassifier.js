import React, { Component } from "react";
import * as speechCommands from '@tensorflow-models/speech-commands';
import Speech from 'speak-tts'
import './AudioClassifier.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from "react-switch";

class AudioClassifier extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.keycount = 1;
    this.tts_key = ["Pop music", "Rock music", "EDM music", "clap"];  // Phân loại thể loại nhạc
    //this.tts_key = ["Clap", "Bark (Dog Sound)", "Cat Sound", "Duck Sound", "Bird Sound"]; // Phân loại tiếng động vật
    //this.tts_key = [ "Clap", "Guitar", "Piano", "Drum", "Trumpet"] // Phân loại tiếng nhạc cụ
    this.state = {
      label: 'Initializing...',
      tts: false,
      logs: [
        // {
        //   id: 0,
        //   text: "Background Noise",
        //   time: "Start"
        // }
      ]
    };
  }

  async componentDidMount() {

    const threshold = 0.95;

    const URL = "https://teachablemachine.withgoogle.com/models/282RjfESx/";
    // https://teachablemachine.withgoogle.com/models/282RjfESx/  -  phân loại nhạc
    // https://teachablemachine.withgoogle.com/models/TyoKC4XJ2/ phân loại tiếng vỗ tay, chó mèo, vịt, chim
    // https://teachablemachine.withgoogle.com/models/UTZry_dIJ/ phân loại nhạc cụ
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const recognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      checkpointURL,
      metadataURL);

    await recognizer.ensureModelLoaded();
    const classLabels = recognizer.wordLabels(); // get class labels


    recognizer.listen(result => {
      for (let i = 0; i < classLabels.length; i++) {
        if (result.scores[i].toFixed(2) > threshold) {
          const classPrediction = classLabels[i];
          // const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
          this.setState({ label: classPrediction });
          const speech = new Speech()

          if (classLabels[i] !== 'Background Noise') {
            for (let j = 0; j < this.tts_key.length; j++) {
              if (classLabels[i] === this.tts_key[j] && this.state.tts === true) {
                speech.speak({
                  text: `${this.tts_key[j]}!`,

                }).then(() => {
                  console.log("Success !")
                }).catch(e => {
                  console.error("An error occurred :", e)
                })
                console.log('TTS gọi với nhãn:', classLabels[i]);
                break;
              }
            }

            var today = new Date(),
              time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            var newelement = { id: this.getKey(), text: classLabels[i], time: time }

            this.setState(prevState => ({
              logs: [...prevState.logs, newelement]
            }))

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

  handleChange(checked) {
    this.setState({ tts: checked });
  }

  getKey() {
    return this.keycount++;
  }

  render() {
    return (
      <div className="background">
        <div className="waveWrapper waveAnimation">
          <div className="waveWrapperInner bgTop">
            <div className="wave waveTop" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-top.png')` }}></div>
          </div>
          <div className="waveWrapperInner bgMiddle">
            <div className="wave waveMiddle" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-mid.png')` }}></div>
          </div>
          <div className="waveWrapperInner bgBottom">
            <div className="wave waveBottom" style={{ backgroundImage: `url('http://front-end-noobs.com/jecko/img/wave-bot.png')` }}></div>
          </div>
        </div>
        <div>
          <div className="audio-class">
            <div className="wrapper">
              <div className="logs">
                <div className="card-div-logs">
                  <h1 className="label-log">Logs</h1>
                  <React.Fragment>
                    <ul className="list-grp">
                      {this.state.logs.length === 0 ? <p>Looks empty. huh.</p> :
                        this.state.logs.reverse().map(listitem => (
                          <li key={listitem.id} className="list-group-item list-group-item-success">
                            {listitem.text + ` - ${listitem.time}`}
                          </li>
                        ))}
                    </ul>
                  </React.Fragment>
                </div>
              </div>
              <div className="main">
                <div className="card-div">
                  <h1 className="label">{this.state.label}</h1>
                  <div className="tts-container">
                    <Switch onChange={this.handleChange} checked={this.state.tts} />
                    <span className="tts-text">Text To Speech</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AudioClassifier;