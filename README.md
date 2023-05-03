# ETL

## Sobre el proyecto

La idea del proyecto es generar una manera sencilla y generica de migrar tablas de una base de datos.
Cuenta con varias funcionalidades para la normalizacion de columnas.

## Como surge el proyecto

Este proyecto surge desde la necesidad de cargar datos en una tabla de un excel que no contiene la informacion de manera exacta
y require su previa manipulacion.

## Adapters

Quise que el proyecto no se limitase a un tipo de archivo, por lo que hice que se pasara
un array de objetos establecidos por una interfaz. Ese objeto puede ser generado de cualquier manera que se crea conveniente, aunque ya el proyecto trae una interface 'FileAdapter' que trae un metodo para pasar un archivo deseado a el formato de objeto.
Tambien trae una interface 'ClientAdapter' con la que tampoco nos limitaremos a un cliente que ejecute la query, sino que podra ser
elegido por el que consuma esta libreria.
Como base ya viene un ejemplo de cada uno en la libreria: *ExcelAdapter* y *PostgresAdapter*.

## Uso

La libreria cuenta con 3 modificadores, que seran una clase de filtro para cada columna:
    - Remove
    - Formaters
    - Transform

### Remove

Este es el mas sencillo, unicamente un array con los elementos del objeto que deseamos eliminar. Este es el ultimo modificador en ejecutar

### Formaters

Este se ejecuta sobre todos las columnas y da la posibilidad de modificar las keys y valores de manera masiva. El proyecto ya trae
3 de ellos, pero no limita al que este usando la libreria a crear sus propios.

Un ejemplo de uno personalizado:

```typescript
const clear: Formater = (obj, key, value) => {
    delete obj[key];
    obj[key.trim()] = value.trim();
};
```

### Transform

Este consiste en poder modificar una unica columna/propiedad del objeto de manera personalizada

```typescript
    const transform = {
      name: (obj, value) => {
        return value.toLowerCase();  // Cambio del nombre a minusculas
      }
    }
```

## Ejemplo de uso

```typescript
new Etl<Alumnos>({
    table: "alumnos",
    connection: getConnectionConfig(), // Metodo personalizado para obtener informacion
    client: new Adapters.PostgresAdapter(), // Cliente postgres para insertar data
    formatters: [
      keysToLowerCase, // Formatter personalizado
      Formaters.changeNames<Alumnos>({wrong_name_col: "name"}), // Cambia el nombre de las claves en la data a el nombre de la columna en la base de datos
      Formaters.clear, // Trim claves y valores
      Formaters.collision([namesOfColsOfTableInDB], 0.85), // Solo conserva las propiedades del objeto que colisionan con el array pasado (la idea que sea las columnas que desea insertar en su tabla)
    ],
    transform: {
      name: (obj, value) => {
        return value.toLowerCase();  // Cambio del nombre a minusculas
      }
    },
    remove: ['id'] // Remueve la propiedad id
  }).run(data);
```
