const typeDefs = `#graphql

  type PaginatedVehicles {
    data: [Vehicle]
    total: Int
    current_page: Int
    last_page: Int
  }
  type User {
      _id: ID
      username: String
      cedula: Int
    }

  type Vehicle {
    _id: ID!
    brand: String
    model: String
    year: Int
    price: Float
    status: String
    image: String
    user_id: ID
  }

input VehicleFilters {
  brand: String
  model: String
  status: String
  search: String
  year_min: Int
  year_max: Int
  minPrice: Float
  maxPrice: Float
  price_range: String
}


  type Query {
    # Ahora recibe page y devuelve el nuevo tipo PaginatedVehicles
    getVehicles(filters: VehicleFilters, page: Int, limit: Int): PaginatedVehicles
    getVehicleById(id: ID!): Vehicle
  }


`;
module.exports = { typeDefs };
