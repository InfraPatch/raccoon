# This is our code and we reserve our rights to it.

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

# Project Raccoon

A Project Raccoon egy egyszerű alkalmazás adásvételi szerződések létrehozására,
aláírására és kezelésére.

## Szükséges szoftverek

- Node.js v12 vagy annál újabb
- MySQL
- [LibreOffice](https://libreoffice.org/download/download) a Word dokumentumok PDF
formátumba való konvertálásához.

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

## Az AVDH engedélyezése

Az AVDH (Azonosításra visszavezetett dokumentumhitelesítés) elérhető a Project Raccoon-on keresztül. A Project Raccoon weboldala jelképezi az AVDH rendszerben az ügyfélkaput, mely a személyazonosság igazolását végzi.

Használhat önállóan aláírt tanúsítványokat tesztelésre, vagy akár megfelelő tanúsítványt, amelyet egy tanúsító hatóság ellenőriz, például a [DigiCert](https://www.digicert.com).

Az AVDH öönállóan aláírt tanúsítvánnyal történő beállításához hozzon létre egy 2048 bites RSA PKCS#12 tanúsítványt az [Adobe Acrobat](https://www.adobepress.com/articles/article.asp?p=1708161&seqNum=4) használatával.

Miután megszerezte a tanúsítványt .p12 formátumban, nevezze át a tanúsítványt "key.p12" névre, és másolja át az ".avdh" mappába.

Meg kell adnia a tanúsítvány visszafejtéséhez használt jelszót a "pass.txt" fájlban az ".avdh" mappában.

## Az AVDH engedélyezése .env fájl használatával

Alternatív megoldásként az AVDH közvetlenül az `.env` fájlban is beállítható.

Először konvertálja a tanúsítványfájlt [Base64 formátumba](https://opinionatedgeek.com/Codecs/Base64Encoder).

Nyissa meg az `.env` fájlt, és állítsa az `AVDH_KEY_BASE64` értékát a tanúsítványa Base64 változatára.

Végül állítsa az `AVDH_KEY_PASSWORD` értéket a tanúsítvány visszafejtéséhez használható jelszóra.

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

A projekt és annak forráskódja az InfraPatch-nek van licenszelve.
