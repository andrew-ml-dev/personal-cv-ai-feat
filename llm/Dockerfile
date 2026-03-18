FROM debian:12-slim

# Install needed packages for building and runtime
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone the latest llama.cpp source
RUN git clone https://github.com/ggml-org/llama.cpp.git .

# Build the engine (disable shared libs so the binary is self-contained)
RUN cmake -B build -DGGML_NATIVE=ON -DBUILD_SHARED_LIBS=OFF
RUN cmake --build build --config Release -j 4 --target llama-server

# Run the server straight from the build output so it always finds its files
ENTRYPOINT ["/app/build/bin/llama-server"]