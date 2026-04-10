const Vehicle = require("../models/vehicles");

const resolvers = {
    Query: {

        // _ es el parent (no se usa en queries raíz)
        // args es lo que mandó el cliente: { filters, page, limit }
        getVehicles: async (_, { filters, page: rawPage, limit = 10 }) => {
            const query = {};
            const f = filters || {}; // por si viene null
            
            // Forzamos que page sea al menos 1
            const page = rawPage && rawPage > 0 ? rawPage : 1;

            // --- LÓGICA DE FILTROS ---
            if (f.search) {
                // Si hay búsqueda, buscamos en marca O modelo
                query.$or = [
                    { brand: { $regex: f.search, $options: 'i' } },
                    { model: { $regex: f.search, $options: 'i' } }
                ];
            }

            if (f.brand) {
                query.brand = { $regex: f.brand, $options: 'i' };
            }

            if (f.status) {
                query.status = f.status;
            }

            // Filtro de Año (Rango)
            if (f.year_min || f.year_max) {
                query.year = {};
                if (f.year_min) query.year.$gte = parseInt(f.year_min);
                if (f.year_max) query.year.$lte = parseInt(f.year_max);
            }

            // Filtro de Precio
            if (f.minPrice || f.maxPrice) {
                query.price = {};
                if (f.minPrice) query.price.$gte = f.minPrice;
                if (f.maxPrice) query.price.$lte = f.maxPrice;
            } else if (f.price_range && f.price_range.includes('-')) {
                // Si viene como "1000-5000", lo separamos
                const parts = f.price_range.split('-');
                const min = parseFloat(parts[0]);
                const max = parseFloat(parts[1]);
                if (!isNaN(min) && !isNaN(max)) {
                    query.price = { $gte: min, $lte: max };
                }
            }
            // ------------------------------------------

            const skip = (page - 1) * limit;

            // Ejecutamos la búsqueda y el conteo al mismo tiempo
            const [data, total] = await Promise.all([
                Vehicle.find(query).skip(skip).limit(limit),
                Vehicle.countDocuments(query)
            ]);

            return {
                data,
                total,
                current_page: page,
                last_page: Math.ceil(total / limit)
            };
        },


        // _ = parent (no se usa), { id } = desestructuramos args directamente
        getVehicleById: async (_, { id }) => {
            return await Vehicle.findById(id);
        }

    }
};

module.exports = { resolvers };