# 01 Docker: Comprehensive Guide & Lab Manual

## 1. Core Architecture & Mental Model

Docker packages an application and its entire runtime environment into an immutable artifact called an **Image**. An executing instance of an image is a **Container**.

```
+-----------------------------------------------------------------------+
| Docker Client (CLI)                                                   |
| docker build | docker run | docker pull | docker push                 |
+-----------------------------------+-----------------------------------+
                                    | Unix Socket / Named Pipe
+-----------------------------------v-----------------------------------+
| Docker Host (dockerd daemon)                                          |
|                                                                       |
|  +--------------------+   Instantiates   +-------------------------+  |
|  |   Docker Images    | ---------------> |    Docker Containers    |  |
|  | (Read-Only Layers) |                  | (Read/Write Top Layer)  |  |
|  +--------------------+                  +-------------------------+  |
|            ^                                                          |
|            | pull / push                                              |
+------------|----------------------------------------------------------+
             v
+-----------------------------------------------------------------------+
| Docker Registry (Docker Hub / AWS ECR)                                |
+-----------------------------------------------------------------------+
```

### Key Differences: Virtual Machines vs Containers
* **Virtual Machine (VM):** Hypervisor abstracts hardware; guest OS runs its own kernel (~GBs, boots in minutes).
* **Docker Container:** Shares host OS kernel; uses Linux namespaces (process isolation) and cgroups (resource limits) (~MBs, boots in sub-seconds).

---

## 2. Essential Docker Command Reference

### A. Lifecycle & Execution
| Command | Purpose | Example |
| :--- | :--- | :--- |
| `docker run` | Create and start a container | `docker run -d -p 80:80 --name web nginx` |
| `docker start` | Start a stopped container | `docker start web` |
| `docker stop` | Gracefully stop running container (SIGTERM -> SIGKILL) | `docker stop web` |
| `docker restart` | Restart a container | `docker restart web` |
| `docker kill` | Force-kill container immediately (SIGKILL) | `docker kill web` |
| `docker rm` | Remove container | `docker rm web` (add `-f` to force) |
| `docker pause` / `unpause` | Freeze/unfreeze container processes | `docker pause web` |

### B. Inspection & Debugging
| Command | Purpose | Example |
| :--- | :--- | :--- |
| `docker ps` | List running containers | `docker ps` |
| `docker ps -a` | List all containers (including stopped) | `docker ps -a` |
| `docker logs` | Fetch logs of a container | `docker logs -f --tail 100 web` |
| `docker exec` | Execute command inside running container | `docker exec -it web sh` |
| `docker inspect` | Low-level JSON metadata (IP, mounts, env) | `docker inspect web` |
| `docker top` | Display running processes of container | `docker top web` |
| `docker stats` | Live streaming resource usage (CPU, RAM, Net) | `docker stats` |

### C. Image Management
| Command | Purpose | Example |
| :--- | :--- | :--- |
| `docker images` | List local images | `docker images` |
| `docker pull` | Pull image from registry | `docker pull node:20-alpine` |
| `docker build` | Build image from Dockerfile | `docker build -t myapp:1.0 .` |
| `docker tag` | Create target tag referencing source image | `docker tag myapp:1.0 user/myapp:latest` |
| `docker push` | Push image to registry | `docker push user/myapp:latest` |
| `docker rmi` | Delete local image | `docker rmi myapp:1.0` |
| `docker history` | Show history and layers of image | `docker history myapp:1.0` |

### D. System & Cleanup
| Command | Purpose | Example |
| :--- | :--- | :--- |
| `docker system df` | View Docker disk space consumption | `docker system df` |
| `docker system prune` | Remove unused containers, networks, dangling images | `docker system prune -a` |

---

## 3. Experiment Walkthroughs (Syllabus Mapped)

### Experiment 5a: Running an Existing Docker Container
1. Pull standard alpine or nginx image:
   ```powershell
   docker pull nginx:alpine
   ```
2. Run container in detached mode with port forwarding:
   ```powershell
   docker run -d -p 8080:80 --name test-nginx nginx:alpine
   ```
   * `-d`: Run in background (detached mode).
   * `-p 8080:80`: Map port 8080 on Windows host to port 80 inside container.
   * `--name test-nginx`: Assign explicit name instead of random generator.
3. Verify access via browser or curl:
   ```powershell
   curl http://localhost:8080
   ```

### Experiment 5b: Manage & Operate Containers (Start, Tag, Rename)
1. Stop container:
   ```powershell
   docker stop test-nginx
   ```
2. Rename container:
   ```powershell
   docker rename test-nginx legacy-web-server
   ```
3. Restart container:
   ```powershell
   docker start legacy-web-server
   ```
4. Tag image with new version identifier:
   ```powershell
   docker tag nginx:alpine my-custom-nginx:v1.0.0
   ```
5. Remove container cleanly:
   ```powershell
   docker stop legacy-web-server
   docker rm legacy-web-server
   ```

---

## 4. Experiment 6: Containerizing a React Application

There are two distinct ways to containerize a React application.

### Approach 1: Development Setup (Hot Reloading)
Runs `npm run dev` or `vite` directly inside container. Great for local coding, but heavy image size (~500MB+ with Node.js runtime and devDependencies).

### Approach 2: Production Setup (Multi-Stage Build with Nginx) - Recommended
Builds static HTML/JS/CSS assets using Node.js in stage 1, then copies purely static files to an ultra-lightweight Nginx alpine image (~25MB) in stage 2.

#### Production Dockerfile (`Dockerfile`)
```dockerfile
# Stage 1: Build static assets
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx website
RUN rm -rf ./*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist .

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerignore file (`.dockerignore`)
Essential to keep images slim and builds fast:
```
node_modules
npm-debug.log
dist
.git
.gitignore
.env.local
```

#### Build and Run Commands
```powershell
# 1. Build image
docker build -t react-app:v1 .

# 2. Run container
docker run -d -p 3000:80 --name react-prod react-app:v1

# 3. Test in browser at http://localhost:3000
```

---

## 5. Experiment 5c & 10: Docker Hub Publishing Workflow

```
[Local Machine]                                  [Docker Hub]
+-------------------------+                     +---------------------------+
| 1. Build Image          |                     |                           |
|    docker build ...     |                     |                           |
|                         |                     |                           |
| 2. Tag with Username    |                     |                           |
|    docker tag img user/img                    |                           |
|                         |                     |                           |
| 3. Authenticate         |                     |                           |
|    docker login         |                     |                           |
|                         |                     |                           |
| 4. Push to Registry     | === (network) ====> | Store Image Layers        |
|    docker push user/img |                     | hub.docker.com/r/user/img |
+-------------------------+                     +---------------------------+
                                                              |
[Remote Server / AWS EC2]                                     |
+-------------------------------------------------------------v-------------+
| 5. Pull & Execute                                                         |
|    docker run -d -p 80:80 user/img:latest                                 |
+---------------------------------------------------------------------------+
```

### Complete CLI Command Sequence
```powershell
# Step 1: Login to Docker Hub
docker login -u <your-dockerhub-username>

# Step 2: Tag image with username namespace
docker tag react-app:v1 <your-dockerhub-username>/react-app:v1.0.0
docker tag react-app:v1 <your-dockerhub-username>/react-app:latest

# Step 3: Push both tags
docker push <your-dockerhub-username>/react-app:v1.0.0
docker push <your-dockerhub-username>/react-app:latest

# Step 4: Simulate pull and execute on clean environment
docker rmi react-app:v1 <your-dockerhub-username>/react-app:latest
docker run -d -p 5000:80 --name fresh-run <your-dockerhub-username>/react-app:latest
```

---

## 6. Windows 10 & Lab Environment Gotchas

1. **Docker Daemon Not Running:**
   * Error: `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine...`
   * Fix: Launch Docker Desktop from the Start menu and wait for the whale icon in the system tray to turn solid green.
2. **Port Collisions:**
   * Ports 8080 (often used by Jenkins) and 3000 (often used by Node dev server) might already be taken.
   * Check open ports on Windows: `netstat -ano | findstr :8080`
   * If occupied, change the host mapping flag, e.g., `-p 8081:80`.
3. **WSL2 vs Hyper-V Backend:**
   * Docker Desktop on Windows 10 runs best with WSL2 (Windows Subsystem for Linux v2). Ensure WSL2 feature is active.

