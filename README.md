# Oblique

URL Shortener that makes use of LowDB to store &amp; search for saved URLs.

# Frontend
 >Under development, still planning. 

# Backend
##### Endpoints
>Let me use the term `BACKEND` to denote the server's root domain.

* **POST** - `BACKEND/create`
    > `link` = string (long URL)

    > `auth` = string (`pms` by default for now)
* **POST** - `BACKEND/find` 
    > `shortLink` = string (shortened URL id) 
* **POST** - `BACKEND/clear` *(Not quite sure if I want to implement it)*
    > `auth` = string (admin key to clear the database) 


### Modules Used
1. [LowDB](https://www.npmjs.com/package/lowdb)
2. [Bluebird Promise](http://bluebirdjs.com)
3. [Openode](https://openode.io) for hosting the backend.