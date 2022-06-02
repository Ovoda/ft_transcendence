

export class Config {
    constructor() {
        this.ensureValues(
            [
                "REACT_APP_BACKEND_URL",
            ]
        )

    }

    private ensureValues(keys: string[]) {
        keys.map((key) => this.getValue(key));
    }

    public getValue(key: string): string {
        const value = process.env[key];

        if (!value) {
            throw new Error(`Error: ${key} is missing in .env`);
        }

        return value;
    }
}


export const config = new Config();