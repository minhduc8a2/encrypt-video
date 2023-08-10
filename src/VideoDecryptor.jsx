import React, { useState } from "react"

const VideoDecryptor = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [decryptionKey, setDecryptionKey] = useState("")
  const [decryptedVideoURL, setDecryptedVideoURL] = useState("")

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleDecryptClick = async () => {
    if (!selectedFile || !decryptionKey) {
      alert("Please select a file and enter a decryption key.")
      return
    }
    try {
      const decryptionKeyBuffer = new TextEncoder().encode(decryptionKey)
      const standardDecryptionKeyBuffer = new Uint8Array(16)
      for (let i = 0; i < Math.min(16, decryptionKeyBuffer.length); i++) {
        standardDecryptionKeyBuffer[i] = decryptionKeyBuffer[i]
      }

      const decryptionCryptoKey = await window.crypto.subtle.importKey(
        "raw",
        standardDecryptionKeyBuffer,
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      )

      const encryptedDataBuffer = await selectedFile.arrayBuffer()
      const iv = new Uint8Array(encryptedDataBuffer.slice(0, 16))
      
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        decryptionCryptoKey,
        encryptedDataBuffer.slice(16)
      )
      console.log(decryptedData)
      const decryptedBlob = new Blob([decryptedData], {
        type: selectedFile.type,
      })
      const decryptedVideoURL = URL.createObjectURL(decryptedBlob)
      setDecryptedVideoURL(decryptedVideoURL)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Client-Side Video Decryption and Playback</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter Decryption Key"
        value={decryptionKey}
        onChange={(event) => setDecryptionKey(event.target.value)}
      />
      <button onClick={handleDecryptClick}>Decrypt and Play</button>
      {decryptedVideoURL && (
        <video controls>
          <source src={decryptedVideoURL} type={selectedFile.type} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}

export default VideoDecryptor
