# Project Raccoon

Project Raccoon is a one-stop solution for creating, managing, and signing sale
contracts online.

## Requirements

- Node.js v14 or newer
- MySQL

## Getting Started

**1. Clone the repository**

```sh
git clone git@github.com:jozsefsallai/project-raccoon.git
cd project-raccoon
```

**2. Install the dependencies**

```
npm i -g yarn
yarn
```

_Note: if `yarn` is not available and/or cannot be installed, use `npm run`
instead of `yarn` in all of the following commands._

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

## Enabling AVDH

AVDH (Document Signatures through Authentication) is available through Project Raccoon. Project Raccoon acts as the customer portal performing identity authentication.

You may use self-signed certificates for testing, or proper certificates verified by a Certificate Authority such as [DigiCert](https://www.digicert.com).

To set up AVDH with self-signed certificate, create a 2048-bit RSA PKCS#12 certificate using [Adobe Acrobat](https://www.adobepress.com/articles/article.asp?p=1708161&seqNum=4).

After procuring your certificate in .p12 format, rename the certificate to `key.p12` and copy it into the `.avdh` folder.

You'll need to provide the password used to decrypt the certificate in a `pass.txt` file inside the `.avdh` folder.

## Enabling AVDH using the .env file

Alternatively, AVDH can be set up directly in the `.env` file.

First, convert your certificate file into the [Base64 format](https://opinionatedgeek.com/Codecs/Base64Encoder).

Open the `.env` file and change `AVDH_KEY_BASE64` to the Base64 version of your certificate.

Finally, set `AVDH_KEY_PASSWORD` to the password used to decrypt your certificate.

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
