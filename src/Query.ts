export class Query {
    public static async fromObject(obj: object, table: string, line = 0, last = false) {
        const keys = Object.keys(obj).map((key) => `"${key}"`);
        const values = Object.values(obj);

        let query = "";
        //If is first line add insert else only charge values (to do only 1 query)
        if (line == 0)
            query += `INSERT INTO ${table} (${keys.join(", ")}) VALUES`;

        //Add values
        query += ` (${values
            .map((value) => {
                if (value instanceof Date) return `'${value.toISOString()}'`;
                if (value == null || value == "") return "NULL";
                if (typeof value == "number") return value;
                return `'${value}'`;
            })
            .join(", ")})${last ? ";" : ",\n"}`;

        return query;
    }
}
