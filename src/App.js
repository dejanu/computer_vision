import React, { Component, Fragment } from 'react';
import ReactDropzone from 'react-dropzone';
import request from "superagent";
import './App.css';

const KEY1 = '460989da17574927b15082a4bb97ae62';
const PERSON_GROUP_ID = '1';

// const URL_LEGO_DETECT = "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/b43094b2-cad6-47f3-9997-9949d77861c9/image";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupPersons: [],
            detectedPersons: [],
            files: [],
            response: {},
        };
    }

    // componentDidMount() {
    //     request.get(URL_PERSONGROUP_PERSON_LIST)
    //         .set("Content-Type", "application/json")
    //         .set("Ocp-Apim-Subscription-Key", KEY1)
    //         .send()
    //         .end((err, res) => {
    //             console.log('get PersonGroup Person List');
    //             if(res && res.body) {
    //                 this.setState({groupPersons: res.body});
    //             }
    //         })
    // }

    onDrop = (files) => {
        console.log('dropped');
        const _this = this;

        _this.setState({
            files: files,
            detectedPersons: []
        }, () => {
            const file = files[0];
            request.post(URL_LEGO_DETECT)
                .set("Content-Type", "application/octet-stream")
                .set("Prediction-Key", KEY1)
                .send(file)
                .end((err, res) => {
                    console.log('detect faces');
                    console.log(res.body);
                    _this.setState({response: res.body});
                    // if(res && res.body) {
                    //     let faceIds = [];
                    //     let processed_persons = [];
                    //     res.body.map(face => {
                    //         faceIds.push(face.faceId);
                    //         processed_persons[face.faceId] = {'faceInfo': face};
                    //     })
                    //     console.log('1',processed_persons);

                    //     request.post(URL_FACE_IDENTIFY)
                    //         .set("Content-Type", "application/json")
                    //         .set("Ocp-Apim-Subscription-Key", KEY1)
                    //         .send({
                    //             "personGroupId": PERSON_GROUP_ID,
                    //             "faceIds": faceIds,
                    //             "maxNumOfCandidatesReturned": 5,
                    //             "confidenceThreshold": 0.5
                    //         })
                    //         .end((err, res) => {
                    //             console.log('identify faces');
                    //             if(res && res.body) {
                    //                 let processed = []
                    //                 res.body.map(face => {
                    //                     if(face.candidates && face.candidates.length > 0) {
                    //                         processed.push({
                    //                             faceInfo: processed_persons[face.faceId].faceInfo,
                    //                             candidateInfo: face.candidates,
                    //                         })
                    //                     } else {
                    //                         processed.push({
                    //                             faceInfo: processed_persons[face.faceId].faceInfo,
                    //                         })
                    //                     }
                    //                 })

                    //                 console.log('2', processed);
                    //                 _this.setState({detectedPersons: processed});
                    //             }
                    //         })
                    // }
                })
        });

    }
  render() {
      const previewStyle = {
          display: 'inline',
          // width: 100,
          // height: 100,
      };

      return (
      <div className="App">
          <div>
              {this.state.files.length > 0 &&
              <Fragment>
                  <div style={{position: 'relative'}}>
                  {this.state.files.map((file) => (
                      <img
                          alt="Preview"
                          key={file.preview}
                          src={file.preview}
                          style={previewStyle}
                      />
                  ))}
                  <div style={{position: 'absolute', top: 0, left: 0}} >
                      {this.state.detectedPersons && this.state.detectedPersons.map((candidate) => (
                          <Fragment>
                              {!candidate.candidateInfo &&
                              <div style={{
                                  position: 'absolute',
                                  top: candidate.faceInfo.faceRectangle.top,
                                  left: candidate.faceInfo.faceRectangle.left,
                                  height: candidate.faceInfo.faceRectangle.height,
                                  width: candidate.faceInfo.faceRectangle.width
                              }} className='not-found'></div>
                              }
                              {candidate.candidateInfo &&
                              <div style={{
                                  position: 'absolute',
                                  top: candidate.faceInfo.faceRectangle.top - 30,
                                  left: candidate.faceInfo.faceRectangle.left,
                                  height: candidate.faceInfo.faceRectangle.height + 30,
                                  width: candidate.faceInfo.faceRectangle.width}} className='found'> {candidate.candidateInfo && this.state.groupPersons.find((person) => (person.personId === candidate.candidateInfo[0].personId))? this.state.groupPersons.find((person) => (person.personId === candidate.candidateInfo[0].personId)).name: 'not-found'}</div>
                              }
                          </Fragment>
                      ))}
                  </div>
                  </div>
              </Fragment>
              }
              <ReactDropzone
              accept="image/*"
              onDrop={this.onDrop}
          >
              Drop your best photo here!!
          </ReactDropzone>
          {/* {
              this.state.response &&
              this.state.response.predictions &&
            
                this.state.response.predictions.map((prediction) => (
                    <div>
                        <span>Probability: {prediction.probability} &nbsp;</span> 
                        <br></br>
                        <span>TagName: {prediction.tagName} &nbsp; </span> 
                        <br></br>
                        </div>
                        
                    ))} */}
          }
          </div>
      </div>
    );
  }
}

export default App;
