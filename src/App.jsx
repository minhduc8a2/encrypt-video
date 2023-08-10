import { useState } from "react"

import "./App.css"
import VideoEncryptor from "./VideoEncryptor"
import VideoDecryptor from "./VideoDecryptor"

function App() {
  const [want, setWant] = useState("")
  function choose(want) {
    setWant(want)
  }
  return (
    <div className="app">
      {want === "" && (
        <div className="option">
          <button className="btn btn-danger" onClick={() => choose("encrypt")}>
            Encrypt Video
          </button>
          <button className="btn btn-primary" onClick={() => choose("decrypt")}>
            Decrypt Video
          </button>
        </div>
      )}
      {want === "encrypt" && <VideoEncryptor />}
      {want === "decrypt" && <VideoDecryptor />}
    </div>
  )
}

export default App
