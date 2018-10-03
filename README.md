# Oblique

URL Shortener that makes use of LowDB to store &amp; search for saved URLs.

# Frontend
- [x] Copy function, let's try DOM way but [ClipboardJS](https://clipboardjs.com/) is the last resort.
    - [x] Add Copy button next to the `userInput` field.
- [x] Add favicon.

### Third-party used
1. [BulmaCSS](https://bulma.io/)
2. [ClipboardJS](https://clipboardjs.com)
3. [Icons8](https://icons8.com/) for [favicon](https://icons8.com/icon/43015/cut).

# Scripts
> These scripts can help you connect and make direct calls to the API Endpoint, needs some configuration. These scripts require you to have `xclip` installed for clipboard interaction, and `jq` for JSON parsing.

1. `oblique.py`, `oblique.sh`
    > Accepts `longurl` parameter, `./oblique.py longurl_here`.
2. `shorten`
    > A bash script written to access the backend privately configured in order to generate different shortened link compared to the backend. Accepts `longurl` parameter as the first argument like `./shorten longurl` or simply execute the script `./shorten`.

![Demo of shorten](https://i.imgur.com/tTlyPnY.gif)

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
3. [~~Openode~~](https://openode.io) for ~~hosting~~ the backend, not anymore! :D

### Thanks to
1. [Random Words API](https://nlp.fi.muni.cz/projekty/random_word/)

***

![Fork in a river](http://www.ohranger.com/sites/ohranger.com/files/imagecache/parkphoto_header/parkphotos/BISO7042.jpg)
![Fork in a river](https://i.imgur.com/vtA82JY.jpg)

>Courtesy to @rafasc & @rewt at Freenode#git.
