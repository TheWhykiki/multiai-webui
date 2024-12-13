# MultiAI WebUI

I made this project in first place for myself as I had many small Python Scripts and simple stuff related to LLMs. So I decided to bundle them all in one simple UI.
MultiAI WebUI is a lightweight and flexible web interface designed as an alternative to Gradio for AI and machine learning applications. This project leverages Flask for the backend and Next.js for the frontend, providing a robust platform for executing custom AI functionalities and embedding Gradio setups using iframes.

## Overview

MultiAI WebUI simplifies the deployment and interaction with AI models by offering a unified platform to manage:

- **Custom AI Workflows:** Features for model training, batch generation via Replicate, and more.
- **Embedded Gradio Apps:** Integrate Gradio-based setups seamlessly through iframes.
- **Responsive Web Interface:** Built using Next.js for a modern and accessible user experience.

## Key Features

### AI Functionalities
- Execute training workflows and batch process tasks via the Flask backend.
- Use integrated tools for custom AI applications.

### Flexible Integration
- Easily embed existing Gradio apps or integrate custom AI workflows into the web interface.

### User-Friendly Design
- Unified startup script for backend and frontend.
- Modular project structure for ease of development and scalability.

## Requirements

### Prerequisites

Ensure the following are installed on your system:

- **Python 3.8+**
- **Node.js 14+**
- **npm or Yarn**
- **pip**
- **Git**

### Dependencies

Required dependencies are listed in:

- `requirements.txt` (Python).
- `package.json` (JavaScript).

Follow the installation steps below.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TheWhykiki/multiai-webui.git
cd multiai-webui
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Set Up the Frontend

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install JavaScript dependencies:

```bash
npm install
# or if you prefer yarn:
yarn install
```

### 4. Configure Environment Variables

- Create `.env` files in the backend and frontend directories as needed.
- Use `.env.example` (if available) as a template.

## Usage

### Starting the Application

Run the `start.sh` script to start both servers:

```bash
./start.sh
```

The script performs the following:

1. Launches the Flask backend server on port `5001`.
2. Launches the Next.js frontend server on port `3000`.

### Accessing the Application

Visit the application in your browser at:

```
http://localhost:3000
```

### Development Mode

#### Running the Backend

```bash
cd backend
flask run --host=0.0.0.0 --port=5001
```

#### Running the Frontend

```bash
cd frontend
npm run dev
```

## Project Structure

```
multiai-webui/
├── backend/         # Flask backend
│   ├── app.py       # Main application script
│   ├── requirements.txt  # Python dependencies
│   └── ...          # Additional backend files
├── frontend/        # Next.js frontend
│   ├── pages/       # Pages for the frontend
│   ├── public/      # Static files
│   ├── package.json # JavaScript dependencies
│   └── ...          # Additional frontend files
├── start.sh         # Unified startup script
└── README.md        # Project documentation
```

## Contributing

We welcome contributions to MultiAI WebUI. To get started:

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature-branch-name`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature-branch-name`).
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Support and Contact

For any questions, feature requests, or bug reports, please open an issue or contact me directly under info@whykiki.de

---

