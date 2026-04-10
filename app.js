require('dotenv').config();

const mongoose = require("mongoose");
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');
const jwt = require('jsonwebtoken');

// Conexión a MongoDB
const mongoString = process.env.MONGODB_URI;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
});

database.once('connected', () => {
    console.log('Database Connected');
    console.log(database.name);
});

// Servidor GraphQL
async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });

    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },

        // Se ejecuta en CADA petición antes del resolver
        context: async ({ req }) => {

            // PASO 1: Leer el header Authorization
            // El header llega como: "Bearer eyJhbGci..."
            // Necesitamos solo la parte del token (sin el "Bearer ")
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');

            // PASO 2: Si no hay token, retornar contexto vacío
            // Las queries públicas (como getVehicles) igual funcionarán
            if (!token) return { user: null };

            // PASO 3: Verificar el token con el mismo secreto del backend
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // decoded contiene los datos que el backend guardó en el token
                return { user: decoded };
            } catch (error) {
                // Token inválido o expirado → contexto vacío
                return { user: null };
            }
        }
    });

    console.log(`🚀 Servidor GraphQL listo en: ${url}`);
}

startServer();