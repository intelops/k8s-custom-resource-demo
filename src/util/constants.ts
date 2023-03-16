export const NAMESPACE = "employee-system";

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development"
}

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
const isDevelopment = (process.env.NODE_ENV === 'development')
let config: Config
if (isDevelopment) {
    config = {
        // app server config
        server_port: process.env.PORT || 5000,
     }
} else {
    config = {
        // app server config
        server_port: process.env.PORT || 5000,
    }
}

export interface Config {
    // app server config
    server_port?: string | number
}

export default config