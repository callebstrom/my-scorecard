import React, { useState } from 'react'
import axios from 'axios'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import FormLabel from '@material-ui/core/FormLabel'
import { ThemeProvider } from '@material-ui/styles'

import { createMuiTheme } from '@material-ui/core/styles';

import Scorecard from './Scorecard'
import CourseSelector from './CourseSelector/index';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#37a03b'
    },
    secondary: {
      main: '#37a03b'
    }
  },
});

const scorecardFormStyle = {
  paddingTop: '5rem',
  paddingLeft: '10vw',
  paddingRight: '10vw',
  maxWidth: '600px',
  margin: '0 auto'
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: 'url("https://i.pinimg.com/originals/9d/b3/38/9db338e15c4971c61b6c48e0de8ab3ee.jpg")',
  backgroundPosition: 'top',
  height: '20rem'
}

const h1Style = {
  fontFamily: 'Roboto Condensed',
  color: 'white',
}

const Header = () => <header style={headerStyle}>
  <h1 style={h1Style}>My Scorecard</h1>
</header>

const renderTees = (slope, tee, setTee) => <div style={{ marginTop: '0.5rem', maxWidth: '5rem' }} className="tees">
  <FormLabel component="legend">Tee *</FormLabel>
  <RadioGroup label="HCP" onChange={({ target: { value: tee } }) => setTee(tee)} name="tee" value={tee}>
    {slope.map(({ tee }) => <>
      <FormControlLabel key={tee} value={tee} control={<Radio />} label={tee} />
    </>)}
    {slope.length === 0 && <>
      <FormControlLabel value="disabled" control={<Radio />} label="Vit" disabled />
      <FormControlLabel value="disabled" control={<Radio />} label="Gul" disabled />
      <FormControlLabel value="disabled" control={<Radio />} label="Röd" disabled />
    </>}
  </RadioGroup>
</div>

const renderGender = (gender, setGender) => <RadioGroup style={{ marginTop: '0.5rem' }} label="HCP" onChange={({ target: { value: gender } }) => setGender(gender)} name="tee" value={gender}>
  <FormLabel component="legend">Gender *</FormLabel>
  <FormControlLabel value="man" control={<Radio />} label="Man" />
  <FormControlLabel value="women" control={<Radio />} label="Women" />
</RadioGroup>

const App = () => {

  const [scorecard, setScorecard] = useState();
  const [slope, setSlope] = useState([]);
  const [tee, setTee] = useState()
  const [gender, setGender] = useState('man');
  const [club, setClub] = useState('664ea941-1a35-4af3-b533-20ac2cdfa60d')
  const [course, setCourse] = useState('3764ef54-dd25-4ebb-81e7-6676cb5d3f93')

  const setStrokes = (hole, strokes) => {
    const updatedScorecard = [...scorecard]
    updatedScorecard[hole - 1].strokes = strokes
    setScorecard(updatedScorecard)
  }

  if (course && !scorecard) {
    axios.get('/api/scorecard', {
      params: {
        club,
        course
      }
    }).then(({ data: scorecard }) => {
      setScorecard(scorecard)
    })
  }

  const slopeForGender = slope.filter(slope => slope.tee === tee).reduce((prev, cur) => gender === 'man' ? cur.menSlope : cur.womenSlope, 0)

  return <div id="app">
    <ThemeProvider theme={theme}>
      <Header />
      <div id="scorecard-form" style={scorecardFormStyle}>
        <CourseSelector
          club={club}
          setClub={setClub}
          course={course}
          setCourse={course => {
            setScorecard()
            setCourse(course)
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="HCP"
          defaultValue={0}
          required
          onChange={({ target: { value: hcp } }) => {
            axios.get('/api/slope', {
              params: {
                club,
                course,
                hcp
              }
            }).then(({ data: slope }) => {
              setSlope(slope)
            })
          }}
          inputProps={{
            step: 0.1,
            max: 54,
            type: 'number'
          }}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        {renderTees(slope, tee, setTee)}
        {renderGender(gender, setGender)}
        <div style={{ marginBottom: '1rem' }}>
          <TextField
            fullWidth
            variant="outlined"
            id="standard-read-only-input"
            label="Slope"
            value={slopeForGender}
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <Scorecard
          scorecard={scorecard}
          setStrokes={setStrokes}
          slope={slopeForGender}
        />
      </div>
    </ThemeProvider>
  </div>
}

export default App