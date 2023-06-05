echo "Cleaning db..."
mongosh rebel-db --host mongodb --eval "db.artists.deleteMany({})"
echo "DB Ready for seeding..."

echo "Seeding Rebel DB..."
jq '.data' /roster.json > /data.json
mongoimport --host mongodb --db rebel-db --collection artists --type json --file /data.json --jsonArray
echo "Seeding Done..."