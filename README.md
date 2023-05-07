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
3 de ellos, pero no limita al que este usando la libreria a crear sus propios. Estos pueden mutar el objeto que reciben.

Un ejemplo de uno personalizado:

```typescript
  const clear: Formater = (obj, key, value) => {
      delete obj[key];
      obj[key.trim()] = value.trim();
  };
```

#### Unica ejecucion

Si necesitara de alguna manera que un formatter se ejecutara una unica vez por objeto, y no en cada propiedad del objeto podria hacer la siguiente implementacion, que pertenece al formatter orderByKeys. Como puede observar lo encapsulamos en una Closure que va a guardar el ultimo objeto ejecutado y se va a encargar de que este solo se ejecute una vez

```typescript
  const orderByKeys: () => Formater = () => {
    let lastObjExecuted: object | null = null;
    return  (unordered, key) => {
        if(lastObjExecuted === unordered) return;
        
        const keys = Object.keys(unordered);
    
        keys.sort().forEach((value) => {
            const auxVal = unordered[value];
            delete unordered[value];
            unordered[value] = auxVal;
        });

        lastObjExecuted = unordered;
    } 
};
```

### Transform

Este consiste en poder modificar una unica columna/propiedad del objeto de manera personalizada. Estos no pueden mutar el objeto, por lo que se debera hacer es retornar el valor

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
      Formaters.orderByKeys() // CASI SIEMPRE NECESARIO. Va a ordenar las propiedades del objeto alfabeticamente. Esto puede ahorrar problemas al ejecutar la query para insertar. Debido a que los objetos no van a tener distinto orden. Unicamente se va a ejecutar una sola vez por objeto
    ],
    transform: {
      name: (obj, value) => {
        return value.toLowerCase();  // Cambio del nombre a minusculas
      }
    },
    remove: ['id'], // Remueve la propiedad id
    chunkItems: 100 // Convierte las queries en chunks del tamaño solicitado
  }).run(data);
```
