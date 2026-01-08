# whatsit

Formerly known as Bloccit, this application is a Reddit-like application. Users can create and edit posts while providing comments and favorites.

---

## Migrations

Run migrations with the following command:

```bash
npx sequelize-cli db:migrate
```

Run test migrations with the following command:

```bash
npx sequelize-cli db:migrate --env test
```

## Unit Tests

Run unit tests with the following command:

```bash
npx vitest
```

## Integration Tests

Run integration tests with the following command:

```bash
npx vitest run spec/integration
```

## Resources

* Node.js
* Express.js
* EJS
* Sequelize
* Postgres
* Passport for validation
* Bcrypt.js for data encryption
