
<img width="1674" height="127" alt="banner" src="https://github.com/user-attachments/assets/b08ec0af-d395-421b-b221-9c8ea9eaf34d" />
<br/><br/>

> XSS (Cross-Site Scripting) es un tipo de ataque de seguridad web donde un atacante inyecta código malicioso, como JavaScript, en un sitio web legítimo. Cuando un usuario visita el sitio afectado, su navegador ejecuta este código, permitiendo al atacante robar información sensible como cookies de sesión o credenciales, redirigir al usuario a sitios maliciosos o incluso secuestrar su cuenta. 

# Demostración basica de XSS
Este repositorio incluye dos aplicaciones de node `app.js` y `app-safe.js`, las dos son iguales y muestran una lista de comentarios.

El script `app-safe.js` incluye sanitización de HTML para prevenir la inserción (y esparcimiento) de código malicioso usando `sanitize-html` y `helmet` para headers.

Al contrario, `app.js` no tiene estas validaciones y la view `index-vulnerable` renderiza directamente **cualquier cosa** que tenga un comentario, habilitando el XSS.

## Uso de las demos
Se debe tener instalado Node/Npm para correr las demos, luego de clonar el repositorio:

#### Instalar dependencias dentro del repo:
```pw
npm i express sqlite3 ejs helmet sanitize-html
```

#### Correr la variante de la app: (Safe o Vulnerable)
```pw
npm run vulnerable
```
```pw
npm run safe
```

## Reiniciar demo:
```
http://<app:port>/reiniciar
```

## Demo
### Inserción de un mensaje malicioso
<img width="820" height="1031" alt="fdfd32" src="https://github.com/user-attachments/assets/9868f930-269e-4fd8-b269-07c1757c1641" />


### Al recargar la página o incluso ingresar desde otro dispositivo
<img width="765" height="492" alt="fdfd32" src="https://github.com/user-attachments/assets/96721414-e015-48ab-b909-87ab6be7886e" />

