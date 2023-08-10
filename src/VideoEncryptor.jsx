import React, { useState } from "react"

const VideoEncryptor = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [encryptionKey2, setEncryptionKey2] = useState("")

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const handleEncryptClick = async () => {
    if (!selectedFile || !encryptionKey2) {
      alert("Please select a file and enter an encryption key.")
      return
    }

    // Convert the encryption key to a Uint8Array
    const keyBuffer = new TextEncoder().encode(encryptionKey2)
    const uint8Array16 = new Uint8Array(16)
    console.log(keyBuffer)
    // Fill the first 16 elements of the uint8Array16 with the key data
    for (let i = 0; i < Math.min(16, keyBuffer.length); i++) {
      uint8Array16[i] = keyBuffer[i]
    }
    const encryptionKeyBuffer = await window.crypto.subtle.importKey(
      "raw",
      uint8Array16,
      { name: "AES-CBC" },
      false,
      ["encrypt", "decrypt"]
    )

    const fileBuffer = await selectedFile.arrayBuffer()
    const iv = window.crypto.getRandomValues(new Uint8Array(16))

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv,
      },
      encryptionKeyBuffer,
      fileBuffer
    )

    const encryptedBlob = new Blob([iv, encryptedData], {
      type: selectedFile.type,
    })

    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(encryptedBlob)
    downloadLink.download = "encrypted_video.enc"
    downloadLink.click()
  }

  return (
    <div>
      <h1>Client-Side Video Encryption</h1>
      <input type="file" onChange={handleFileChange} />
      <input
        type="password"
        placeholder="Enter Encryption Key"
        value={encryptionKey2}
        onChange={(event) => setEncryptionKey2(event.target.value)}
      />
      <button onClick={handleEncryptClick}>Encrypt and Download</button>
    </div>
  )
}

export default VideoEncryptor
