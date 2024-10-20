# Spotify Song of the Day

A containerized web application that challenges users to guess the daily Spotify song through a series of clues and short preview clips.

## Features

- Daily song selection from Spotify
- Short preview clips for users to guess the song
- Clue system based on song attributes (artist, album, year, genre, etc.)
- Spotify Web Playback SDK integration for in-browser playback
- User progress tracking
- Containerized using Docker for easy deployment and scaling

## Technologies Used

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- Spotify Web API
- Spotify Web Playback SDK
- TailwindCSS
- NextAuth.js for Spotify authentication
- Docker
- Docker Compose

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Docker
- Docker Compose
- Spotify Developer account and API credentials

## Installation and Running with Docker

1. Clone the repository:
2. Navigate to the project directory:
3. Create a `.env` file in the root directory and add the necessary environment variables:
  - DATABASE_URL="postgresql://username:password@db:5432/dbname"
  - SPOTIFY_CLIENT_ID="your-spotify-client-id"
  - SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"
  - NEXTAUTH_SECRET="your-nextauth-secret"
  - NEXTAUTH_URL="http://localhost:3000"
4. Build and start the Docker containers:
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Configuration

This project uses Docker and Docker Compose for containerization. The main configuration files are:

- `Dockerfile`: Defines the container for the Next.js application
- `docker-compose.yml`: Orchestrates the application and database containers

(Please provide the content of these files so we can include them in the README)

## Development Without Docker

If you prefer to run the application without Docker for development:

1. Ensure you have Node.js (v14 or later) and PostgreSQL installed locally.
2. Install dependencies:
npm install
3. Set up the database:
npx prisma migrate dev
4. Start the development server:
npm run dev --turbo

## Deployment

This application can be deployed on any platform that supports Docker containers. Make sure to set up the environment variables in your deployment platform's settings.

## Contributing

Contributions to the Spotify Song of the Day project are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Spotify for providing the API and SDK
- The Next.js team for the awesome framework
- Docker for containerization
- All contributors and supporters of this project
