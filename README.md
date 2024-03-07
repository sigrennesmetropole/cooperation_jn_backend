# Cooperation Jumeau Numérique Back-End

## Quick start

### Installation

```shell
npm i
```

### File .env

Create a .env file using the example in .env.example

You should request sensitive information directly from the project team. For example the value of : ENEDIS_CLIENT_ID, ENEDIS_CLIENT_SECRET

### Configuration file

To run, the project need a configuration.json file.
Example value (use for dev env) can be found [here](https://github.com/sigrennesmetropole/cooperation_jn_conf/blob/main/dev/configuration.json).
You need to put a valid configuration file in the `src/config` directory.

By default, when "npm run dev" is launched the app start in "local" mode which means it looks inside this local
configuration file instead of looking from the remote one used when running in production.

### Run the app in dev mode

```shell
npm run dev
```

## Docker

### Build locally the image

```shell
docker build -t cooperation_jn_backend:latest --build-arg NPM_TOKEN=<YOUR_GITHUB_NPM_TOKEN> .
```

### Run the image

See the .env.docker.example for the creating .env.docker file. Make sure no single quote or double quote in the environment.

```shell
docker run --rm -p 4321:4321 --env-file ./.env.docker --name cj-backend cooperation_jn_backend:latest
```
