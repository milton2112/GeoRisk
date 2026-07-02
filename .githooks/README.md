# Hooks locales

Instalar una vez con:

```sh
npm run hooks:install
```

El hook `pre-push` corre `npm run prepush:check`, una puerta rapida para no subir una version que ya falla en presupuesto de arranque, idioma de datos, arranque inicial o validacion general.
