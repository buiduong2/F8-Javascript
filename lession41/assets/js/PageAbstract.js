export class QuizzPage {
    constructor(app, prop = {}) {
        this.app = app;
        this.validateProp(prop);
        this.prop = prop;
    }
    validateProp(prop) {
        const schema = this.getPropSchema();
        const queue = [];
        queue.push({ data: prop, schema });
        while (queue.length > 0) {
            const { data, schema } = queue.shift();
            for (const key in schema) {
                if (!(key in data))
                    throw new Error(`Key: ${key} is not exists`);
                if (typeof data[key] !== schema[key].type)
                    throw new Error(`Typeof: ${key} does not match`);
                if (schema[key].type === 'object' && schema[key].schema) {
                    queue.push({ data: data[key], schema: schema[key].schema });
                }
            }
        }
    }
    goNextPage(data, nextPageCon) {
        this.app.goNextPage(data, nextPageCon);
    }
}
