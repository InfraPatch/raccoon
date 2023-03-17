# Project Raccoon

A Project Raccoon egy egyszerű alkalmazás adásvételi szerződések létrehozására, aláírására és kezelésére.

## Szükséges szoftverek

- Node.js v12 vagy annál újabb
- MySQL

## Első lépések

**1. Klónold a repository-t**

```sh
git clone git@github.com:infrapatch/raccoon.git
cd raccoon
```

**2. Telepítsd a csomagokat**

```
npm i -g yarn
yarn
```

*Megj.: ha a `yarn` elérhető és/vagy nem telepíthető, a következő parancsok
mindegyikében `yarn` helyett használj `npm run`-t.*

**3. Hozz létre egy felhasználót és egy adatbázist**

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

**4. Hozd létre a dotenv konfigurációt**

```sh
cp .env.example .env
nano .env
```

**5. Futtasd le a database migration-okat**

```
yarn migrate
```

**6. Indítsd el a dev szervert**

```
yarn dev
```

**7. Production módban való futtatáshoz használd a következő parancsokat**

```
yarn build
yarn start
```

A legelső felhasználó regisztrálása után ajánlatos beállítani azt
adminisztrátorként. Ehhez lépj be a MySQL szerverbe és futtasd le az alábbi
parancsot:

```sql
UPDATE raccoon.users SET isAdmin=1 WHERE id=1;
```

Miután a felhasználó adminisztrátori jogot kapott, az alkalmazás ügyfélkapujában
kinevezhet új adminisztrátorokat.

## Hasznos parancsok

### Lintelés

```
yarn lint
```

### Migration generálása

```
yarn migration:generate MigrationNeve
```

### Migration visszavonása

```
yarn migration:rollback
```

### Build-elés production-ra

```
yarn build
```

## Licensz

A projekt és annak forráskódja a [NISZ](https://www.nisz.hu/)-nek van licenszelve.
