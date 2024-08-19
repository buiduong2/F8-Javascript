
import { QuizzApp } from "./App.js";

export abstract class QuizzPage<P> {
    app: QuizzApp;
    prop: P;

    constructor(app: QuizzApp, prop: any = {}) {
        this.app = app;
        this.validateProp(prop)
        this.prop = prop;

    }

    validateProp(prop: any): void {
        const schema = this.getPropSchema();
        const queue: { data: any, schema: PropSchema | undefined }[] = [];
        queue.push({ data: prop, schema });

        while (queue.length > 0) {
            const { data, schema } = (queue.shift() as { data: any, schema: PropSchema });
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

    abstract getPropSchema(): PropSchema;


    public goNextPage(data: any, nextPageCon: PageContructor) {
        this.app.goNextPage(data, nextPageCon);
    }


    abstract render(): void;

    abstract remove(): Promise<void>;
}

export type PageContructor = new (...args: any[]) => QuizzPage<any>;
export type PropSchema = {
    [key: string]: {
        type: string,
        schema?: PropSchema
    }
}

