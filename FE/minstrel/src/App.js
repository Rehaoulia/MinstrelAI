import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Button } from 'react-bootstrap'
import { generateLyrics, generateMusic } from '../src/Controller'
import Player from "react-howler-player";

function App() {

  const [prompt, setPrompt] = useState("a song about a sad cat");
  const [genre, setGenre] = useState("Rock");
  const [lyrics, setLyrics] = useState('');
  const [generatedAudioUrl, setgeneratedAudioUrl] = useState('');




  const getLyrics = async (e, fullprompt) => {
    const query = { "query": fullprompt }
    e.preventDefault();
    const response = await generateLyrics(query);
    console.log(response);
    console.log(response.data);
    setLyrics(response.data.split('Answer:')[1]);
    console.log('after set:' + lyrics)
  }

  const getMusic = async () => {
    console.log('get music called high level')
    setgeneratedAudioUrl('');
    if (lyrics != '') {
      const response = await generateMusic(lyrics, genre);
      console.log(response);
      setgeneratedAudioUrl(response.data.data.response.sunoData[0]["audioUrl"]);
    } else {
      console.log(lyrics)
    }
  }

  //useEffect(() => { getMusic() }, [lyrics]);


  const onPlayerReady = (data) => {
    console.log(data);
  };

  const timeUpdate = (data) => {
    console.log(data);
  };

  return (
    <div className='App'>

      <div className='form-wrapper'>
        <Container>
          <Form>
            <Row>
              <h1 style={{ marginBottom: '50px', textAlign: 'center' }}>
                Welcome to Minstrel
              </h1>
            </Row>
            <Row>
              <Col sm={6}>
                <Container fluid>
                  <Row>
                    <Col style={{ marginBottom: '10px' }}>
                      <h4>Enter the prompt here:</h4>
                      <Form.Control as='textarea' rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    </Col>
                  </Row>
                  <Row>
                    <Form.Group className='mb-3' controlId='formSelect'>
                      <Form.Select value={genre} aria-label="Default select example" onChange={(e) => setGenre(e.target.value)}>
                        <option>Select Genre</option>
                        <option value="Rock">Rock</option>
                        <option value="Funk">Funk</option>
                        <option value="Jazz">Jazz</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Button variant='primary' type='submit' onClick={(e) => getLyrics(e, prompt + " In the genre of " + genre)}>
                    Generate Lyrics
                  </Button>
                </Container>
              </Col>
              <Col sm={6}>
                <Container>
                  <Row>
                    <Col style={{ marginBottom: '10px' }}>
                      <Form.Control as='textarea' rows={8} value={lyrics} onChange={(e) => { setLyrics(e.target.value) }} className='mb-3' />
                      <Button variant='primary' className='mb-3' onClick={() => { getMusic(); }}>
                        Generate Song
                      </Button>
                      {(lyrics != '' && generatedAudioUrl != '') && (<Player
                        src={[generatedAudioUrl]}
                        isDark={true}
                        onTimeUpdate={timeUpdate}
                        onLoad={onPlayerReady}
                      />)}
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Form>
        </Container>
      </div >
    </div>
  );
}

export default App;
