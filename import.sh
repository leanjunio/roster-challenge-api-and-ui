#! /bin/bash

jq '.data' roster.json > data.json
mongoimport --host mongodb --db rebel-db --collection artists --type json --file data.json --jsonArray
