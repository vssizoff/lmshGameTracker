if [[ ! -f "./.env" ]]; then
  echo "DB_PASSWORD=PASSWORD" > ./.env
fi
