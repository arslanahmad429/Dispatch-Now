# Secure File Upload Backend Server

This is a template Node.js Express backend server designed for secure file uploads. It protects your local system from malicious file uploads using several security layers.

## Features

1. **UUID Filename Randomization**: Never trusts client-side filenames. Renames every uploaded file to a randomized UUID (e.g. `2dbbb4b9-8e68-45a7-96a6-3829ad0c31d1.pdf`) to prevent path traversal and execution hijack attacks.
2. **Magic Bytes (File Signature) Verification**: Inspects the first 12 bytes of uploaded files to verify their file headers against a strict whitelist (PNG, JPEG, WEBP, and PDF). If a script or executable is masked as an image (e.g., `backdoor.png` containing PHP code), it is detected, blocked, and instantly deleted from disk.
3. **Strict Size Limits**: Rejects files larger than `5MB` to prevent Denial of Service (DoS) attacks.
4. **Execute-Disabled Serving**: Configures static file serving with headers to prevent browser execution:
   - Sets `X-Content-Type-Options: nosniff` to prevent browsers from executing code disguised as safe formats.
   - Sets `Content-Security-Policy: default-src 'none'; sandbox;` to restrict script execution.

## Getting Started

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the secure server:
   ```bash
   npm start
   ```
   The backend server will run at: `http://localhost:5000`
