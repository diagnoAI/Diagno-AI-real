Diagno AI – Kidney Stone Detection Web App
A smart web application built for doctors to detect and classify kidney stones from CT scan images using AI/ML models, with an auto-generated patient report.

Features
Doctor-only login and signup (JWT authentication)

Upload kidney CT scan images

AI-based kidney stone detection with:

Highlight stones

Size, shape, and location identification


Auto-generated report with:

Patient details

Uploaded vs detected image comparison

Stone Details

Save or Print as PDF (A4 layout)

Search patients by name or register number

For Easily Retrive Old Patients Reports

Dark/light mode toggle

Mobile-responsive and user-friendly UI

Tech Stack

Frontend: React.js (Vite), JavaScript, Tailwind CSS

Backend: Flask (Python), JWT Auth

Database: MongoDB (Atlas)

AI/ML: OpenCV, U-Net segmentation, CNN classification

Tools: Google Colab (Model training), GitHub, Labelme

### Login Page
![Login Page](https://github.com/diagnoAI/Diagno-AI-real/blob/9dd46da2250fd165c675842bf9d59c66cb653278/assets/Login.png.jpg)

### Upload Form
![Upload Form](https://github.com/diagnoAI/Diagno-AI-real/blob/9dd46da2250fd165c675842bf9d59c66cb653278/assets/Upload.jpg)

### Detection Result
![Detection Result](https://github.com/diagnoAI/Diagno-AI-real/blob/9dd46da2250fd165c675842bf9d59c66cb653278/assets/display.jpg)

### Final Report
![Final Report](https://github.com/diagnoAI/Diagno-AI-real/blob/9dd46da2250fd165c675842bf9d59c66cb653278/assets/report.jpg)

### Report Retrive
![Report Retrive](https://github.com/diagnoAI/Diagno-AI-real/blob/9dd46da2250fd165c675842bf9d59c66cb653278/assets/ReportRetrive.png.jpg)


How to Run
Clone this repository

Setup backend in /backend folder (Python, Flask)

Setup frontend in /frontend folder (React + Vite)

Use MongoDB URI in .env files

Run frontend and backend on separate ports



About the Team

Final Year B.Sc. IT Students

Project Duration: Jan 2025 – Apr 2025

Built with passion and care for the healthcare domain