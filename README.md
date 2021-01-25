 # API WALLET

 ## How to start the project 
  
 install node version 8.11.0 or use nvm to downgrade your node version 
 
 delete the existing package.lock.json and run
 copy .env.example to .env
 then run install node module
`````
 cp .env.example .env
 npm install
`````
 then you create a mysql database Named [**wallet-api**]  with the following credentials 
 then running
 ```` 
 docker-compose up
 ````
 username : root
 
 password : wallet@api
 
 run the migration using the following command :
 ````
  npx sequelize-cli db:migrate
 ````
 Finally, you run 
 ````
 npm start
 ````
  
Future improvements utilize component based structure

