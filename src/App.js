import React, {useState, useEffect, useRef} from "react";
import Button from '@material-ui/core/Button';
import AddBoxTwoToneIcon from '@material-ui/icons/AddBoxTwoTone';
import IndeterminateCheckBoxTwoToneIcon from '@material-ui/icons/IndeterminateCheckBoxTwoTone';
import PlayCircleFilledTwoToneIcon from '@material-ui/icons/PlayCircleFilledTwoTone';
import PauseCircleFilledTwoToneIcon from '@material-ui/icons/PauseCircleFilledTwoTone';
import ReplayTwoToneIcon from '@material-ui/icons/ReplayTwoTone';
import Beep from "./assets/audio6.wav";
import './App.css';

const modes = {
  SESSION: "Session",
  BREAK: "Break"
}

const Clock = () => {

  const [brk, setBrk] = useState(5)
  const [session, setSession] = useState(25)
  const [chrono, setChrono] = useState(25 * 60)
  const [mode, setMode] = useState(modes.SESSION)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFirstSession, setIsFirstSession] = useState(true)

  const beep = useRef()

  const Reset = () => {
    setBrk(5)
    setSession(25)
    setChrono(25 * 60)
    setMode("Session")
    setIsPlaying(false)
    setIsFirstSession(true)
    beep.current.pause()
    beep.current.currentTime = 0
  }

  const decrement = (option) => {
    if(option === modes.BREAK){
      if(!isPlaying && brk > 1){
        setBrk(prevState => prevState - 1)
      }
    }
    if(option === modes.SESSION){
      if(!isPlaying && session > 1){
        setSession(prevState => {
          setChrono((prevState - 1) * 60)
          return prevState - 1
        })
      }
    }
  }

  const increment = (option) => {
    if(option === modes.BREAK){
      if(!isPlaying && brk < 60){
        setBrk(prevState => prevState + 1)
      }
    }
    if(option === modes.SESSION){
      if(!isPlaying && session < 60){
        setSession(prevState => {
          setChrono((prevState + 1) * 60)
          return prevState + 1
        })
      }
    }
  }

  useEffect(() => {
    const handleSwitch = () => {
      if(mode === modes.SESSION){
        setMode(modes.BREAK)
        setChrono(brk * 60)
      } else if(mode === modes.BREAK){
        if (isFirstSession){
          setIsFirstSession(false)
        }
        setMode(modes.SESSION)
        setChrono(session * 60)
      }
    }

    let timer
 
    if (isPlaying && chrono > 0){
      timer = setInterval(() => {
        setChrono(chrono - 1)
      }, 1000)
    } else if (isPlaying && chrono === 0){
      beep.current.play()
      timer = setInterval(() => {
        handleSwitch()
      }, 1000)
    } else {
      clearInterval(timer)
    }
    return () => clearInterval(timer)
  }, [chrono, isPlaying, brk, session, mode])

  let minutes = Math.floor(chrono / 60)
  let seconds = chrono % 60

  return(
    <div id="container">
      <div id="row1">
        <h1>Clock 25 + 5</h1>
        <div id="parameters">
          <div id="session-label">
            Session Length
            <div id="session-length">{session}</div>
            <Button id="session-increment" onClick={() => increment(modes.SESSION)}>
              <AddBoxTwoToneIcon/>
            </Button>
            <Button id="session-decrement" onClick={() => decrement(modes.SESSION)}>
              <IndeterminateCheckBoxTwoToneIcon/>
            </Button>
          </div>
          <div id="break-label">Break Length
            <div id="break-length">{brk}</div>
            <Button id="break-increment" onClick={() => increment(modes.BREAK)}>
              <AddBoxTwoToneIcon/>
            </Button>
            <Button id="break-decrement" onClick={() => decrement(modes.BREAK)}>
              <IndeterminateCheckBoxTwoToneIcon/>
            </Button>
          </div>
          
        </div>
      </div>
      
      <div id="row2">      
        <div id="timer-label">
          {mode}
          <div id="time-left">
            {minutes < 10 ? ("0" + minutes).slice(-2) : minutes}:
            {seconds < 10 ? ("0" + seconds).slice(-2) : seconds}
          </div>
          <Button id="start_stop" onClick={isPlaying ? () => setIsPlaying(false) : () => setIsPlaying(true)}>
            {isPlaying ?  <PauseCircleFilledTwoToneIcon/> : <PlayCircleFilledTwoToneIcon/> }
          </Button>
          <Button id="reset" onClick={() => Reset()}>
            <ReplayTwoToneIcon/>
          </Button>
          {mode === modes.BREAK && <div>A break as begun</div>}
          {(mode === modes.SESSION && !isFirstSession) && <div>A session has begun</div>}
        </div>
        <audio ref={beep} id="beep" src={Beep}/>
      </div>

    </div>
    
  )
}

export default Clock;
