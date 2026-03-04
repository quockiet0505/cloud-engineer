FROM postgres:15

RUN apt-get update && \
    apt-get install -y wget ca-certificates lzop pv zstd && \
    
    wget https://github.com/wal-g/wal-g/releases/download/v3.0.3/wal-g-pg-ubuntu-20.04-amd64.tar.gz && \
    
    tar -zxvf wal-g-pg-ubuntu-20.04-amd64.tar.gz && \
    
    mv wal-g-pg-ubuntu-20.04-amd64 /usr/local/bin/wal-g && \
    chmod +x /usr/local/bin/wal-g && \
    
    rm wal-g-pg-ubuntu-20.04-amd64.tar.gz && \
    apt-get clean && rm -rf /var/lib/apt/lists/*