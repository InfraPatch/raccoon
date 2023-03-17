# Project Raccoon

Project Raccoon is a one-stop solution for creating, managing, and signing sale contracts online.

## Requirements

- Node.js v12 or newer
- MySQL

## Getting Started

**1. Clone the repository**

```sh
git clone git@github.com:infrapatch/raccoon.git
cd raccoon
```

**2. Install the dependencies**

```
npm i -g yarn
yarn
```

*Note: if `yarn` is not available and/or cannot be installed, use `npm run`
instead of `yarn` in all of the following commands.*

**3. Create a user and a database**

```
mysql -u root -p
```

```sql
CREATE USER raccoon@localhost IDENTIFIED BY 'raccoon';
CREATE DATABASE raccoon;
GRANT ALL PRIVILEGES ON raccoon.* TO raccoon@localhost WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit
```

**4. Create a dotenv config**

```sh
cp .env.example .env
nano .env
```

**5. Run the migrations**

```
yarn migrate
```

**6. Start the dev server**

```
yarn dev
```

**7. Build and start the production server**

```
yarn build
yarn start
```

After registering your first user, you might want to make it an administrator.
You can log into your MySQL server and run the following command to do so:

```sql
UPDATE raccoon.users SET isAdmin=1 WHERE id=1;
```

After the user has received administrator permissions, they will be able to add
new administrators in the app's dashboard.

## Useful Commands

### Linting

```
yarn lint
```

### Generating Migrations

```
yarn migration:generate NameOfMigration
```

### Migration Rollback

```
yarn migration:rollback
```

### Building for Production

```
yarn build
```

## License

The project as well as its source code are licensed to [NISZ](https://www.nisz.hu/).
