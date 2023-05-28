# This is our code and we reserve our rights to it.

https://blog.sallai.me/nisz-competition-disappointment

We put our time, effort, dedication, and heart into this project to make it the
best sell contract management platform ever built. Despite all our efforts, it
just wasn't enough for NISZ, so we did not receive what we felt we deserved for
it. We will not let NISZ benefit on our hard work. This code and project belong
to us, the developers, who've spent days upon nights building it and sometimes
gave up on classes and exams just to make everything pixel-perfect. NISZ shall
not take advantage of this, as it counts as literal stealing, both of our code
and our time.

Let these words guard our hard work and effort for thousands of iterations yet
to come.

https://infrapatch.notion.site/Project-Raccoon-e45fcdec09e04d88ba5594e8bbef8545

# Project Raccoon

Project Raccoon is a one-stop solution for creating, managing, and signing sale
contracts online.

## Requirements

- Node.js v12 or newer
- MySQL
- [LibreOffice](https://libreoffice.org/download/download) for converting Word documents to
PDF files.

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

## License

The project as well as its source code are licensed to InfraPatch.
