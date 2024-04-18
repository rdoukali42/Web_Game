FROM debian:latest

RUN apt-get update && apt-get install -y \
		npm

COPY . /app/
WORKDIR /app
RUN chmod +x start.sh

CMD /bin/bash -c "./start.sh"
