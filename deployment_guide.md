# Deployment Guide: Hosting React & Node.js on Namecheap

This step-by-step guide walks you through deploying the **Dispatch Now** application (both the React frontend and Node.js backend) on a single Namecheap cPanel hosting account.

---

## 1. Local Preparation (On Your Laptop)

Before uploading the files to Namecheap, you must build the React frontend and copy the compiled assets into the backend server directory.

1. Open a terminal or Command Prompt inside the main `dispatch-now` directory on your laptop.
2. Build the React project by running:
   ```bash
   npm run build
   ```
   *This command compiles the React code and outputs static HTML, CSS, and JS files into a new directory named `dist`.*
3. Copy the entire `dist` folder from `dispatch-now/dist` and paste it inside the backend `server` folder (so it is located at `dispatch-now/server/dist`).
4. Package the server folder:
   * Go inside the `dispatch-now/server` directory.
   * Select all files and folders **EXCEPT `node_modules`** (specifically select `dist`, `data`, `database.js`, `package.json`, `server.js`, and `README.md`).
   * Right-click and compress these items into a single ZIP file named **`server.zip`**.

---

## 2. Uploading Files to cPanel

1. Log in to your **Namecheap cPanel** dashboard.
2. Locate and click on **File Manager**.
3. In the left-hand directory tree, navigate to your home directory `/home/your_username/`.
4. Create a new folder named **`nodeapp`** (this will be the root directory for your Node.js application).
5. Open the `nodeapp` folder, click **Upload** at the top of cPanel, select **`server.zip`** from your laptop, and upload it.
6. Once uploaded, right-click **`server.zip`** inside cPanel File Manager and select **Extract**. Extract all files directly into the `/home/your_username/nodeapp` folder.

---

## 3. Configuring the Node.js Application in cPanel

1. Go back to the main cPanel dashboard screen.
2. In the search bar, type **Node.js** and click on **Setup Node.js App**.
3. Click the **Create Application** button on the right.
4. Fill out the application settings fields as follows:
   * **Node.js version**: Select `18.x` or `20.x` (or the latest version available).
   * **Application mode**: Select `Production`.
   * **Application root**: Enter `nodeapp` *(this matches the folder name we created in step 4 of Section 2)*.
   * **Application URL**: Select your domain name (e.g., `dispatchnow.us` or `www.dispatchnow.us`). Keep the text field next to it blank.
   * **Application startup file**: Type `server.js` *(this matches our backend Express entry file)*.
5. Click **Create** in the top right.
   *This starts the environment container. You will see a message confirming the application was created.*

---

## 4. Installing Backend Dependencies

1. Under the newly created application panel, scroll down to the **"Configuration files"** section. cPanel will automatically detect the `package.json` file we uploaded.
2. Click the **Run NPM Install** button.
   *This installs all required backend dependencies (Express, Cors, Helmet, Multer) directly on the hosting server. Wait 1–2 minutes for the loading circle to finish.*
3. Once complete, click the **Restart** button at the top of the Setup Node.js App page to apply all changes.

---

## 5. Testing and Verification

1. Open your web browser and navigate to your domain (e.g., `https://dispatchnow.us`).
2. The homepage of **Dispatch Now** should load immediately.
3. Try registering a new driver via `/register/carrier` or logging in.
4. Verify that the files (like Driver compliance documents and Bills of Lading) can be successfully uploaded and viewed. The server will dynamically save uploads inside the database file at `nodeapp/data/db.json` and keep everything running.
