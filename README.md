# Page Pulse 🔍

**Page Pulse** is a web-based website auditing tool that analyzes a webpage and generates a report covering SEO, accessibility, content, and basic performance metrics.

Users enter a website URL, and Page Pulse fetches and analyzes the webpage to identify important issues and provide an overall website health score.

## 🚀 Live Demo

**Live Application:**  https://page-pulse-mlj8.onrender.com

## ✨ Features

* 🔗 Analyze any publicly accessible webpage by URL
* 🔎 SEO analysis
* ♿ Basic accessibility checks
* 📝 Content analysis
* ⚡ Basic performance measurement
* 📊 Overall website health score
* 🏷️ Page title and meta description detection
* 📌 H1 heading analysis
* 🖼️ Images missing `alt` attributes
* 📄 Word count
* 🔗 Canonical URL detection
* ⏱️ Page response time

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* Axios
* Cheerio

### Deployment

* Render

## ⚙️ How It Works

The application follows this basic flow:

```text
User enters website URL
        ↓
React Frontend
        ↓
Express API
        ↓
Fetch webpage using Axios
        ↓
Parse HTML using Cheerio
        ↓
Extract website metrics
        ↓
Calculate health score
        ↓
Return audit report
        ↓
Display results in the UI
```

## 📊 What Page Pulse Analyzes

| Category      | Metrics                                                  |
| ------------- | -------------------------------------------------------- |
| SEO           | Page title, meta description, H1 headings, canonical URL |
| Accessibility | Images missing `alt` attributes                          |
| Content       | Word count and page structure                            |
| Performance   | Page response time                                       |
| Overall       | Website health score                                     |

## 💻 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/satyamrajput01/page-pulse.git
```

Navigate into the project:

```bash
cd page-pulse
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file if your local setup requires environment variables.

Use `.env.example` as a reference.

**Do not commit your `.env` file or expose API keys/secrets.**

### Run the Application

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in your terminal.

## 📁 Project Structure

```text
page-pulse/
├── assets/
├── src/
├── server.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
├── .gitignore
└── README.md
```

## 🎯 Project Goals

Page Pulse was built to provide a simple way for developers and website owners to quickly identify common webpage issues without manually inspecting the HTML source.

The project also demonstrates practical experience with:

* React-based frontend development
* REST API development
* HTML parsing
* Backend/frontend integration
* Website data extraction
* Deployment of a full-stack application

## 🔮 Future Improvements

* More advanced accessibility checks
* Additional SEO recommendations
* Lighthouse-style performance metrics
* Broken-link detection
* Mobile responsiveness analysis
* Historical audit reports
* Exportable audit reports
* More detailed recommendations for detected issues

## 📄 License

This project is available for educational and portfolio purposes.
