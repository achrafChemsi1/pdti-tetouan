
# 🗺️ PDTI Tetouan 2026 Dashboard - Local Setup Guide

Follow these steps to get your dashboard running on your local machine with full visual fidelity.

## 📋 Prerequisites
- **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (use the LTS version).
- **Code Editor**: I recommend [Visual Studio Code](https://code.visualstudio.com/).

## 🚀 Installation Steps

1.  **Create a Project Folder**:
    Create a folder named `pdti-dashboard` and move all your files into it.

2.  **Organize Your Files**:
    Your folder structure should look like this:
    ```text
    pdti-dashboard/
    ├── public/
    │   └── diapo.png        <-- MOVE YOUR PHOTO HERE
    ├── services/
    │   ├── projectData.ts
    │   ├── adminBoundaries.ts
    │   └── mapLayersData.ts
    ├── components/
    │   ├── ProvincePresentation.tsx
    │   └── ... (other components)
    ├── App.tsx
    ├── index.tsx
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
    ```

3.  **Install Dependencies**:
    Open your terminal/command prompt in that folder and run:
    ```bash
    npm install
    ```

4.  **Start the App**:
    Run the following command:
    ```bash
    npm run dev
    ```
    The terminal will give you a link (usually `http://localhost:3000`). Open it in your browser.

## 🖼️ Fixing the 'diapo.png' Issue

If the photo is still not appearing, check these three things:

1.  **The Public Folder**: In Vite, files in the `public` folder are mapped to the root. If your image is at `public/diapo.png`, the code `src="diapo.png"` will find it perfectly.
2.  **Case Sensitivity**: Ensure the filename is exactly `diapo.png` (all lowercase). If it is `Diapo.PNG`, it might work on Windows but fail once you host it online.
3.  **File Format**: Ensure the file is a real PNG. If you renamed a `.jpg` to `.png` manually, the browser might struggle to render it.

## 🛠️ Visual Customization
To change the look and feel, you can edit the Tailwind classes directly in the component files. The app uses:
- **Inter**: For clean, readable UI text.
- **Space Grotesk**: For bold, professional headings.
- **Tailwind CSS**: For all styling and animations.
