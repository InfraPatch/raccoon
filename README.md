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
