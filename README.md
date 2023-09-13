# Cooperation Jumeau Numérique Back-End

## Quick start

#### Installation

```shell
npm i
```

#### File .env

Create a .env file using the example in .env.example

You should request sensitive information directly from the project team. For example the value of : ENEDIS_CLIENT_ID, ENEDIS_CLIENT_SECRET

#### Run the app in dev mode

```shell
npm run dev
```

## Docker

### Build locally the image

```shell
docker build -t cooperation_jn_backend:latest .
```

### Run the image

See the .env.docker.example for the creating .env.docker file. Make sure no single quote or double quote in the environment.

```shell
docker run --rm -p 4321:4321 --env-file ./.env.docker --name cj-backend cooperation_jn_backend:latest
```
