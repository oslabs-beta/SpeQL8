<p align="center">
<img src="https://cdn.discordapp.com/attachments/825525502444961872/849873256672002068/SpeQL81.png" width="300" />
</p>
<h1 align ="center">SpeQL8</h1>
<p align="center">Speculative GraphQL metrics for your Postgres databases</p>
<p align="center">✨✨✨</p>

___
## About
SpeQL8 enables you to run GraphQL queries on an existing Postgres database and collect request-response metrics per query.  View and compare query response times from both your database and from a lightning fast Redis cache, all in the comfort and security of your local development environment.

Upload a .sql or .tar file to spin up your postgres database from SpeQL8 or simply plug in a Postgres database client URL (e.g. ElephantSQL).

___
## Get Started With SpeQL8:
You can either spin up locally on your own machine, or inside a Docker container:
A) Local Install
* Fork and clone this repository
* Ensure you have an instance of Redis Server active.
* Run npm install && npm build && npm start
* Open localhost:3333

B) Containerized
* Fork and clone this repository
* In the SpeQL8 root directory, run the command `npm run speql8`
* Open localhost:3333
* please note - creating GraphQL API instances from a .sql or .tar file is a forthcoming feature in the containerized version
___
## Prerequisites
Be sure to have PostgreSQL and Docker installed on your local machine before attempting to run SpeQL8 via Dockerfile. If running locally, you'll need Redis CLI & Redis Server installed.
___
## Built With
[Apollo-Server](https://www.apollographql.com/docs/apollo-server/) | [Socket.IO](https://socket.io) | [ioredis](https://docs.redislabs.com/latest/rs/references/client_references/client_ioredis/) | [Postgraphile](https://www.graphile.org/postgraphile/) | [GraphiQL](https://github.com/graphql/graphiql) | [React](https://reactjs.org) | [Node.js](node.js) | [Express](https://expressjs.com) | [Docker-Compose](https://docs.docker.com/compose/) | [PostgreSQL](https://www.postgresql.org)

Thank you!
___
## Contribute
SpeQL8 is open-source and accepting contributions. If you would like to contribute to SpeQL8, please fork [this repo](https://github.com/oslabs-beta/SpeQL8), add changes to a feature branch, and make a pull request. Thank you for your support and contributions, and don't forget to give us a ⭐!
___
## Maintainers
🌠 [Allan MacLean](https://github.com/allanmaclean)

🌠 [Akiko Hagio Dulaney](https://github.com/akikoinhd)

🌠 [Ekaterina Vasileva](https://github.com/vs-kat)

🌠 [Russell Hayward](https://github.com/russdawg44)

___

## License
This product is released under the MIT License

This product is accelerated by [OS Labs](https://opensourcelabs.io/).
