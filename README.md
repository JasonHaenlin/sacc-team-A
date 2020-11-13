# sacc-team-A

Welcome to Sacc Team A Project

## Project

project id  : sacc-team-A
region      : europe-west
cloud task  : europe-west1

## To install

```npm install```

```gcloud config set project sacc-team-a```

## To run at local

```npm run dev```

## To deploy

```npm run deploy```

## Emulator datastore

### Prepare

```
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_PROJECT_ID=sacc-team-a
export DATASTORE_USE_PROJECT_ID_AS_APP_ID=true
```

### Run emulator

```
npm run emulator
```

## Emulator SQL

## Download

[https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test](https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test)

### Run emulator

```
npm run sql
```
## Create task

gcloud tasks queues create default
gcloud tasks queues describe default
gcloud tasks locations list
