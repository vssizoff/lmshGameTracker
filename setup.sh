if [[ ! -f "./.env" ]]; then
  echo "DB_PASSWORD=PASSWORD
REDIS_PASSWORD=PASSWORD" > ./.env
fi
