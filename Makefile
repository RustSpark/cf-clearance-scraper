.PHONY: stop restart start

stop:
	docker stop cf

start:
	(docker build -t cf . && echo "build success") && \
	(docker start cf && echo "start success") && \
	(docker run -d -p 3001:3000 -e PORT=3000 -e browserLimit=20 -e timeOut=6000 -e authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2VjMGUxNWY1ZjQ3MWIyMmVhMjlmNyIsIm5iZiI6MTczMjc2MzM1NSwidXNlcm5hbWUiOiJhZG1pbiJ9.M9ZqSRUIXTafnkqgI40zh8Ig77ARetgveDYKpqfD_wQ --name cf --restart always cf && echo "server is running")

restart: stop start
