# SpeQL8
SpeQL8 enables you to run GraphQL queries on an existing postgres database and collect request-response metrics per query.  View and compare query response times from both your database and from a lightning fast Redis cache.


Upload a .sql or .tar file to spin up your postgres database from SpeQL8 or simply plug in a Postgres database client URL (e.g. ElephantSQL).



## Set up your Redis cache:

You are going to need a Redis cache running to use this application.
Please refer to the Redis Quick Start Guide:

https://redis.io/topics/quickstart

After successfully installing Redis, be sure your Redis db is up and running before starting SpeQL8!

In a separate terminal, run `redis-server`


## Get Started With SpeQL8:

* Run `npx install speql8`
* In your browser window, navigate to `http://localhost:8080`
* Upload your database file or plug in your database URL in the left-side and give it a name.  Select the corresponding schema tab that pops up and enter your GraphQL query in the GraphiQL element.