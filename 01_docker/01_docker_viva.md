# 01 Docker Viva Preparation Guide: Comprehensive Theory & Q&A

This document covers all high-frequency viva, practical lab exam, and technical interview questions for Docker, containerization, and React deployment pipelines.

---

## Section 1: Core Architecture & Operating System Primitives

### Q1: What is Docker, and how does containerization differ from traditional Virtualization?
* **Virtual Machines (VMs):** Rely on a Hypervisor (Type 1 bare-metal or Type 2 hosted) to emulate virtual hardware. Each VM runs a full guest operating system with its own kernel, binaries, and libraries. This causes high memory overhead (~GBs) and slow boot times (minutes).
* **Docker Containers:** Utilize OS-level virtualization. Containers share the host operating system kernel and run as isolated user-space processes. They share kernel resources, start in milliseconds, and consume minimal storage (~MBs).

### Q2: What underlying Linux kernel features make Docker work?
Docker isolates processes using two core Linux kernel primitives:
1. **Namespaces (Isolation):** Provides what a container can *see*.
   * `pid`: Process tree isolation (container process sees itself as PID 1).
   * `net`: Network stack isolation (independent IP address, routing table, ports).
   * `mnt`: Mount points and filesystem isolation.
   * `ipc`: Inter-process communication isolation.
   * `uts`: Hostname and domain name isolation.
   * `user`: User ID and group ID mappings.
2. **Control Groups / cgroups (Resource Management):** Enforces what a container can *use*.
   * Limits and meters CPU shares, RAM allocations, disk I/O, and network bandwidth per container.

### Q3: What is the Docker Engine architecture?
Docker Engine is a client-server application comprising three parts:
1. **Docker Daemon (`dockerd`):** A persistent background process that listens for API requests and manages Docker objects (images, containers, networks, volumes).
2. **Docker REST API:** The interface defining how applications instruct the daemon.
3. **Docker CLI (`docker`):** The command-line client used by developers to communicate with `dockerd` over a Unix domain socket (Linux) or named pipe (Windows).

### Q4: How does the Union File System (UnionFS / Overlay2) work?
Docker images are built as a stack of read-only layers.
* Each instruction in a Dockerfile creates a new read-only layer.
* When a container starts, Docker mounts a thin, writable layer on top called the **Container Layer** (Read/Write).
* It uses **Copy-on-Write (CoW)**: When a container modifies an existing file from an underlying image layer, the file is copied up into the read-write layer before modification. The original image layer remains completely untouched.

---

## Section 2: Images, Dockerfile, and Build Mechanics

### Q5: What is the exact difference between an Image and a Container?
* **Image:** A static, read-only package containing application source code, runtime, libraries, environment variables, and configuration files. It is analogous to a class in Object-Oriented Programming.
* **Container:** An active, running (or stopped) instance of an image with an attached read-write layer and isolated network/process namespace. It is analogous to an object instantiated from a class.

### Q6: What is the difference between `CMD` and `ENTRYPOINT`?
This is one of the most common viva questions:
* **`ENTRYPOINT`:** Defines the fixed executable to run when the container starts. It is not easily overridden by CLI arguments.
* **`CMD`:** Defines default parameters or fallback commands for the container. Any CLI argument passed to `docker run <image> <args>` will completely override `CMD`.
* **Standard Pattern:**
  ```dockerfile
  ENTRYPOINT ["nginx"]
  CMD ["-g", "daemon off;"]
  ```
  Running `docker run my-nginx` executes `nginx -g "daemon off;"`.
  Running `docker run my-nginx -v` executes `nginx -v` (only `CMD` was replaced).

### Q7: What is the difference between Shell Form and Exec Form in a Dockerfile?
* **Exec Form (Recommended):** `CMD ["node", "server.js"]`
  * Runs directly without a shell wrapper.
  * Node becomes PID 1 and receives OS signals like `SIGTERM` and `SIGINT` directly, enabling graceful shutdown.
* **Shell Form:** `CMD node server.js`
  * Spawns `/bin/sh -c "node server.js"`.
  * The shell becomes PID 1. Signals sent by `docker stop` hit `/bin/sh` and may not forward to Node, preventing graceful shutdowns.

### Q8: What is the difference between `COPY` and `ADD`?
* **`COPY`:** Strictly copies local files and directories from the build context into the container filesystem. This is the industry standard for security and predictability.
* **`ADD`:** Has two additional features:
  1. Automatically extracts local `.tar`, `.tar.gz`, or `.bz2` archives directly into the container.
  2. Downloads files from external HTTP/HTTPS URLs directly into the image.
* **Best Practice:** Always prefer `COPY` unless you specifically require local archive extraction.

### Q9: What is a Multi-Stage Build, and why is it mandatory for frontend frameworks like React?
A multi-stage build uses multiple `FROM` statements in a single Dockerfile.
* In stage 1 (Builder), we use a heavy Node.js image to install `devDependencies` and compile React source code using `npm run build`.
* In stage 2 (Production), we use an ultra-lightweight web server (like `nginx:alpine`).
* We copy **only** the static `/dist` bundle from Stage 1 into Stage 2 with `COPY --from=builder`.
* **Advantages:**
  1. Image size shrinks from ~500MB (Node runtime + dependencies) down to ~25MB (Nginx + static HTML/JS).
  2. Eliminates vulnerabilities by removing Node runtime and npm build tools from production.

### Q10: How does Docker Layer Caching work, and why does Dockerfile line ordering matter?
Docker evaluates each instruction from top to bottom. If a layer and its inputs have not changed since the last build, Docker reuses the cached layer.
* If a layer changes, that layer and **all subsequent layers** must be rebuilt from scratch.
* **Bad Practice:**
  ```dockerfile
  COPY . .
  RUN npm install
  ```
  Every time any code file changes, `npm install` runs again from scratch.
* **Best Practice:**
  ```dockerfile
  COPY package*.json ./
  RUN npm install
  COPY . .
  ```
  Dependencies are cached unless `package.json` or `package-lock.json` changes.

### Q11: What is the difference between `ARG` and `ENV`?
* **`ARG` (Build-time):** Variables available only while the image is building via `docker build --build-arg KEY=VAL`. They do not persist in the running container.
* **`ENV` (Runtime):** Environment variables embedded into the image metadata that persist when the container executes via `docker run -e KEY=VAL`.

### Q12: Does the `EXPOSE` instruction actually open the port on the host?
No. `EXPOSE 80` serves purely as metadata and documentation indicating which port the application listens on inside the container. It does not publish or bind the port to the host system. Port publishing requires the `-p` or `-P` flag during `docker run`.

---

## Section 3: Container Lifecycle and Commands

### Q13: What happens behind the scenes during `docker run -d -p 8080:80 --name web nginx`?
1. The CLI queries the local image cache for `nginx:latest`. If missing, it executes `docker pull nginx:latest` from Docker Hub.
2. The daemon allocates a container ID and prepares a read-write layer on top of the image layers.
3. The daemon sets up network isolation, connects the container to the default bridge network, and allocates an internal private IP.
4. The daemon configures iptables/NAT forwarding rules to route traffic from host port 8080 to container port 80.
5. The container process starts in the background (`-d`), and the daemon prints the container ID.

### Q14: What is the difference between `docker stop`, `docker kill`, and `docker pause`?
* **`docker stop`:** Sends `SIGTERM` to the container process (PID 1). Gives the application a grace period (default 10 seconds) to flush connections and shut down cleanly. If it fails to exit within 10 seconds, it sends `SIGKILL`.
* **`docker kill`:** Immediately sends `SIGKILL` without waiting for cleanup.
* **`docker pause`:** Uses the Linux cgroups freezer subsystem to suspend all process threads in memory without terminating the process or releasing resources. `docker unpause` resumes execution instantly.

### Q15: What is the difference between `docker exec` and `docker attach`?
* **`docker exec`:** Spawns a **new** process inside an already running container (e.g., `docker exec -it web sh`).
* **`docker attach`:** Connects your local terminal standard input, output, and error streams directly to the container's primary process (PID 1). Pressing `Ctrl+C` inside an attached session terminates the entire container.

### Q16: What do the flags `-i` and `-t` mean in `docker run -it` or `docker exec -it`?
* **`-i` (`--interactive`):** Keeps `STDIN` open even if not attached, allowing you to pass input to the container.
* **`-t` (`--tty`):** Allocates a pseudo-TTY (terminal emulator), providing a formatted shell prompt with colors and line breaks.

### Q17: What is the difference between `docker rm` and `docker rmi`?
* **`docker rm`:** Removes one or more stopped **containers**.
* **`docker rmi`:** Removes one or more **images** from local disk storage. An image cannot be deleted if an existing container (even a stopped one) depends on it.

### Q18: What is `docker system prune`?
A maintenance cleanup command that deletes:
* All stopped containers.
* All unused networks.
* All dangling images (layers with `<none>:<none>` tag).
* Build cache.
Adding `-a` deletes all unused images, not just dangling ones.

---

## Section 4: Data Persistence (Volumes vs Bind Mounts)

### Q19: Why are containers considered ephemeral, and how do we persist data?
Containers are stateless by design. If a container crashes, is stopped, or is destroyed, any data written to its writable layer is permanently lost. To persist data, Docker provides two primary storage mechanisms:

| Feature | Docker Volumes | Bind Mounts |
| :--- | :--- | :--- |
| **Location** | Managed by Docker (`/var/lib/docker/volumes/`) | Anywhere on host filesystem (`C:\data` or `/home/user`) |
| **Management** | Managed via Docker CLI (`docker volume create`) | Managed by host OS file explorer / bash |
| **Portability** | High (isolated from host filesystem quirks) | Low (relies on host directory structure) |
| **Performance** | Native Linux filesystem performance | May encounter translation overhead on Windows/Mac |
| **Best Use Case** | Databases, production state, shared container data | Local development (live code reload / source mounting) |

### Q20: What is a `tmpfs` mount?
A temporary mount that stores files directly in host system memory (RAM). It is never written to disk or the container writable layer. Commonly used for sensitive tokens, passwords, or high-throughput temporary caches.

---

## Section 5: Networking & Docker Hub

### Q21: What are the main Docker Network Drivers?
1. **Bridge (Default):** Creates an internal virtual network on the host (`docker0`). Containers receive private IP addresses and communicate with each other. Outbound traffic is NAT-translated.
2. **Host:** Removes network isolation between container and host. The container shares the host network stack directly (no port mapping needed). Only works natively on Linux.
3. **None:** Disables all networking. Container has only a loopback interface (`127.0.0.1`).
4. **Overlay:** Enables multi-host networking across different physical machines or VMs (used in Docker Swarm and Kubernetes).
5. **Macvlan:** Assigns a MAC address to a container, making it appear as a physical hardware device on the network.

### Q22: Why should you create a custom bridge network instead of using the default bridge?
* On the **default bridge**, containers can only communicate with each other using raw IP addresses unless legacy `--link` flags are used.
* On a **user-defined bridge** (`docker network create my-net`), Docker provides automatic **DNS resolution**. Containers can resolve and communicate with each other simply using container names (e.g., `http://backend-api:5000`).

### Q23: What is the Docker Hub image naming convention?
The complete image identifier format is:
```
[registry_host/][namespace/]repository_name[:tag]
```
* Example: `docker.io/library/nginx:alpine`
* When pushing your own image: `<username>/<repo_name>:<version_tag>`
* If no tag is provided, Docker automatically assumes `:latest`.

---

## Section 6: Exit Codes & Troubleshooting

### Q24: What do common Docker exit codes mean?
* **Exit Code 0:** Clean, normal termination.
* **Exit Code 1:** Application error or uncaught exception in code.
* **Exit Code 127:** Command not found (e.g., trying to run `bash` on an alpine image that only contains `sh`).
* **Exit Code 137 (128 + 9):** Process received `SIGKILL` (often triggered by Linux kernel OOM Killer because container exceeded memory limit).
* **Exit Code 143 (128 + 15):** Process received `SIGTERM` (graceful termination from `docker stop`).

### Q25: How do you debug a container that exits immediately after starting?
1. Check logs: `docker logs <container_name_or_id>`.
2. Inspect exit code: `docker inspect <container> --format='{{.State.ExitCode}}'`.
3. Override entrypoint to keep container alive for debugging:
   ```powershell
   docker run -it --entrypoint sh <image_name>
   ```

---

## Quick Viva Rapid-Fire Checklist

| Question Prompt | Rapid Answer |
| :--- | :--- |
| How do you list hidden/stopped containers? | `docker ps -a` |
| How do you check live memory and CPU usage? | `docker stats` |
| How do you inspect low-level container JSON? | `docker inspect <container>` |
| How do you rename a container? | `docker rename <old_name> <new_name>` |
| Which instruction defines the working directory? | `WORKDIR /path` |
| How do you remove all unused images and volumes? | `docker system prune --volumes -a` |
| Where are Docker volumes stored in Linux? | `/var/lib/docker/volumes/` |
| What signal does `docker stop` send first? | `SIGTERM` (signal 15) |
| What signal does `docker kill` send? | `SIGKILL` (signal 9) |

