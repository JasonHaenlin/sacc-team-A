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

#### Shell
```
export DATASTORE_EMULATOR_HOST=localhost:8081
export DATASTORE_PROJECT_ID=sacc-team-a
export DATASTORE_USE_PROJECT_ID_AS_APP_ID=true
```

#### Powershell
```powershell
# to set
$Env:DATASTORE_EMULATOR_HOST = 8081
$Env:DATASTORE_PROJECT_ID = "sacc-team-a"
$Env:DATASTORE_USE_PROJECT_ID_AS_APP_ID = "true"
# to get (test)
$Env:DATASTORE_EMULATOR_HOST
$Env:DATASTORE_PROJECT_ID
$Env:DATASTORE_USE_PROJECT_ID_AS_APP_ID
```

### Run emulator

```
npm run datastore
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

## Scaling

`automatic_scaling` : set how the app will verticaly scall

The scall factor depends on the class instance of the app.

| Classe d'instance | Limite de mémoire | Limite de processeur | Types de scaling acceptés |
| ----------------- | ----------------- | -------------------- | ------------------------- |
| F1 (par défaut)   | 256 Mo            | 600 MHz              | Automatique               |
| F2                | 512 Mo            | 1,2 GHz              | Automatique               |
| F4                | 1 024 Mo          | 2,4 GHz              | Automatique               |
| F4_1G             | 2 048 Mo          | 2,4 GHz              | Automatique               |
| B1                | 256 Mo            | 600 MHz              | Manuel, basique           |
| B2 (par défaut)   | 512 Mo            | 1,2 GHz              | Manuel, basique           |
| B4                | 1 024 Mo          | 2,4 GHz              | Manuel, basique           |
| B4_1G             | 2 048 Mo          | 2,4 GHz              | Manuel, basique           |
| B8                | 2 048 Mo          | 4,8 GHz              | Manuel, basique           |

default is `F1` for our app

`target_cpu_utilization` : treshold of the processor when a new instance should start

`min_instances` : minimum number of instance to start

`max_instances` : minimum number of instance to deploy if needed

`min_pending_latency` : the minimum amount of time a request need to wait before being process.

`max_pending_latency` : the maximum of time a request can wait if the queue if full depending on the max concurrent requests.

`max_concurrent_requests` : maximum number of request on an instance before a new one need to start
