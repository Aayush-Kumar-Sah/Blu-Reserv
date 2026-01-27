# Podman Setup Instructions

Here are the commands to build and run the application using Podman.

## Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Build the backend image:**
    ```bash
    podman build -t restaurant-backend .
    ```

3.  **Run the backend container:**
    ```bash
    podman run -d -p 5555:5555 --env-file .env --name backend restaurant-backend
    ```

## Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Build the frontend image:**
    ```bash
    # Note: We pass the API URL as a build argument
    podman build -t restaurant-frontend --build-arg REACT_APP_API_URL=http://localhost:5555/api .
    ```

3.  **Run the frontend container:**
    ```bash
    podman run -d -p 3000:8080 --name frontend restaurant-frontend
    ```

## Verification

-   **Backend API:** [http://localhost:5555](http://localhost:5555)
-   **Frontend App:** [http://localhost:3000](http://localhost:3000)
-   **Check running containers:**
    ```bash
    podman ps
    ```
