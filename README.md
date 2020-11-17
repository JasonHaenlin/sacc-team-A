# sacc-team-A

Welcome to Sacc Team A Project.

## Delivery information (in french)

> /!\ La livraison est prévue pour mercredi. Nous vous remercions d'attendre un peu si le projet n'est toujours pas prêt :(

Les requêtes Postman à exécuter se trouvent dans le dossier `./postman`. Il faut les importer dans Postman.

Pour faire des requêtes administrateur comme les requêtes de statistiques (`GET api/stats/complex ou api/stats/simple`) ou de marquage de personne (`PUT api/user/SHA1`), il ne faut pas oublier de mettre l'adresse email d'un admin dans le champ Authorisation pour avoir le droit de faire la requête en tant qu'administrateur.

Pour recevoir les emails de résultat de statistiques, il faut créer un administrateur qui possède votre adresse mail.

### Précisions sur les statistiques

Il existe des statistiques simples et des statistiques complexes.

#### Authorisation

Pour recevoir les emails, il faut créer un administrateur qui possède votre adresse mail. Il faut ensuite faire les requêtes de statistiques (`GET api/stats/complex ou api/stats/simple`) ou de marquage de personne (`PUT api/user/SHA1`) en n'oubliant pas de mettre votre adresse email dans le champ Authorisation pour avoir le droit de faire la requête en tant qu'administrateur.

#### Statistiques simples

Les statistiques simples sont faciles à calculer et le résultat est renvoyé directement dans le corps de la réponse HTTP.
Il existe deux types statistiques simples :

- Le nombre d'utilisateurs
- Le nombre de personnes d'intérêt

#### Statistiques complexes

Les statistiques complexes prennent du temps à être calculées. La requête REST renvoie donc un "OK" à leur appel mais le résultat est différé et est généré dans un fichier.
Il existe deux types de statistiques complexes :

- La liste des personnes d'intérêt et leurs contacts sur les dernières 24 heures. Un fichier est généré à la fin du calcul et le lien est envoyé par email à l'administrateur.
- La génération d'une heatmap montrant les personnes ayant été en contact avec une autre personne (donc les points de rencontre). Une fois la heatmap générée, le lien est envoyé par email à l'administrateur (https://sacc-team-a.ew.r.appspot.com/heatmap).

> DANS LE CAS OU L'EMAIL N'EST PAS RECU :
>
> - Pour la liste des personnes d'intérêts et de leurs contacts, vous pouvez récupérer le lien du fichier (ainsi que de tous les fichiers créés) dans les journaux d'activité ou dans le Stockage (et voir le bucket) de AppEngine.
> - Pour la heatmap, elle est visualissable ici après génération : https://sacc-team-a.ew.r.appspot.com/heatmap

Comme ces calculs peuvent prendre du temps et qu'ils sont fait très peu souvents, nous pouvons nous permettre de faire attendre un peu plus l'utilisateur (en utilisant un PubSub qui permet au serveur de récupérer la requête dès qu'il le souhaite).

### Contenu de la vidéo

VIDEO : https://youtu.be/8iP6grvwn2Q

Dans la vidéo, on lance un scénario sur postman. Voici le contenu de ce scénario :

- Crée 2 administrateurs
- Crée 200 utilisateurs
- Crée 100 rencontres d'utilisateurs
- Marque 50 utilisateurs en tant que PoI

Ce scénario est lancé 13 fois en parallèle.

Au cours de l'exécution de ce scénario, toutes les 3 secondes, une requête de statistiques complexes est exécutée afin que le serveur ai un grand nombre de données à traiter.

Pendant ces requêtes, on voit sur la vidéo que le nombre d'instances augmente sur la console Google au fur et à mesure des requêtes.

## Architecture

![Architecture](/assets/architecture.png)

## Project

project id : sacc-team-A
region : europe-west
cloud task : europe-west1

## To install

`npm install`

`gcloud config set project sacc-team-a`

## To run at local

`npm run dev`

## To deploy

`npm run deploy`

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

`target_cpu_utilization` : treshold of the processor when a new instance should start [0,5 and 0,95, default 0.6]

`min_instances` : minimum number of instance to start

`max_instances` : minimum number of instance to deploy if needed

`min_pending_latency` : the minimum amount of time a request need to wait before being process.

`max_pending_latency` : the maximum of time a request can wait if the queue if full depending on the max concurrent requests.

`max_concurrent_requests` : maximum number of request on an instance before a new one need to start [max 80, default 10]

## Pub-sub

Create a topic
`gcloud pubsub topics create <YOUR_TOPIC_NAME>`

Create a subscription
`gcloud pubsub subscriptions create <YOUR_SUBSCRIPTION_NAME>`
