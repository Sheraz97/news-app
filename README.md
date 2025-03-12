News App - Running in a Docker Container
This guide provides step-by-step instructions for running the News App project within a Docker container. Docker allows you to containerize the application, ensuring it runs consistently across different environments.

Prerequisites
Before you begin, ensure you have the following installed on your machine:

Docker:

Download and install Docker from here.

Verify the installation by running:

bash
Copy
docker --version
Project Files:

Ensure you have the following files in your project directory:

Dockerfile

package.json

src/ (contains your React app code)

Other necessary files (e.g., tsconfig.json, .env, etc.).

Steps to Run the Project in Docker
Step 1: Clone the Repository (Optional)
If you haven't already cloned the repository, run the following command:

bash
Copy
git clone <repository_url>
cd <project_directory>
Step 2: Build the Docker Image
Navigate to the root directory of your project (where the Dockerfile is located) and build the Docker image:

bash
Copy
docker build -t news-app .
-t news-app: Tags the image with the name news-app.

.: Specifies the build context (current directory).

Step 3: Run the Docker Container
Once the image is built, run the container using the following command:

bash
Copy
docker run -d -p 3000:80 news-app
-d: Runs the container in detached mode (in the background).

-p 3000:80: Maps port 80 inside the container to port 3000 on your local machine.

news-app: The name of the Docker image to run.

Step 4: Access the Application
Open your browser and navigate to:

http://localhost:3000
You should see your News App running.

Step 5: Stop the Docker Container
To stop the running container, follow these steps:

Find the Container ID:
Run the following command to list all running containers:

bash
docker ps
Look for the container ID of the news-app image.

Stop the Container:
Use the container ID to stop the container:

bash
docker stop <container_id>
Remove the Container (Optional):
If you want to remove the container after stopping it, run:

bash
docker rm <container_id>
Optional: Using Docker Compose
If you prefer using Docker Compose, follow these steps:

Create a docker-compose.yml File:
In the root of your project, create a docker-compose.yml file with the following content:

yaml
version: "3.8"
services:
  app:
    image: news-app
    build: .
    ports:
      - "3000:80"
Start the Container:
Run the following command to start the container:

bash
docker-compose up
Stop the Container:
To stop the container, use:

bash
docker-compose down
Troubleshooting
Docker Build Fails:

Ensure all required files (e.g., package.json, src/) are present in the project directory.

Check for errors in the Dockerfile.

Application Not Accessible:

Verify the container is running:

bash
docker ps
Ensure the correct port is mapped (e.g., -p 3000:80).

Environment Variables:

If your app uses environment variables (e.g., API keys), ensure they are passed to the Docker container using the -e flag or a .env file.

Example Commands
Build and Run:

bash
docker build -t news-app .
docker run -d -p 3000:80 news-app
Stop and Remove:

bash
docker stop <container_id>
docker rm <container_id>
Docker Compose:

bash
docker-compose up
docker-compose down
