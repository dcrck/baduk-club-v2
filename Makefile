# HASH := `git rev-parse --short HEAD`

SERVICE := website
PROJECT := baduk-club 

IMAGE := gcr.io/$(PROJECT)/$(SERVICE)

sapper:
	@echo "\n~> building Sapper app"
	@npm run build 


docker:
	@echo "\n~> building docker image"
	@gcloud builds submit --tag $(IMAGE)


deploy: sapper docker
	@echo "\n~> deploying $(SERVICE) to Cloud Run servers"
@gcloud beta run deploy $(SERVICE) --allow-unauthenticated --region us-central1 --image $(IMAGE) --memory=512Mi --platform managed
