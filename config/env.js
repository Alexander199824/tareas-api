const env = {
  database: 'examenfinalweb',
  username: 'examenfinalweb_user',
  password: 'nTPBtM1jsmmzhITE238TEErwUfA2nzK9',
  host: 'dpg-cskj26qj1k6c73bialg0-a.oregon-postgres.render.com',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  stripeSecretKey: 'sk_test_51Q9AMkB3EtWqqOZ24k1VyZOOgpCNnVY0CunpMiDNtdS9auObuqik24wzWMIJd09gWmvqSgfs55j1A8MPXtCiBjEf00zin7p46b' // Reemplaza con tu clave de Stripe
};

module.exports = env;
