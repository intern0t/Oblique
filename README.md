# Oblique

URL Shortener that makes use of LowDB to store &amp; search for saved URLs.

# Frontend
 >Under development, still planning. 

### Framework Used
1. [BulmaCSS]()

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

***

![Fork in a river](http://www.ohranger.com/sites/ohranger.com/files/imagecache/parkphoto_header/parkphotos/BISO7042.jpg)
![Fork in a river](https://i.imgur.com/vtA82JY.jpg)

>Courtesy to @rafasc & @rewt at Freenode#git.