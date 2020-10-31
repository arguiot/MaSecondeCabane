import { gql } from "graphql-request"


export const AllProducts = gql`
query AllProducts($size: Int) {
    allProducts(_size: $size) {
        data {
            name
            image
            quantity
            description
            descriptionEn
            price
            sexe
            size
            brand
            etat
            type
            tags
            favorite
            composition
            _id
        }
    }
}
`

export const ProductByID = gql`
query ProductByID($id: ID!) {
    findProductByID(id: $id) {
        name
        image
        quantity
        description
        descriptionEn
        price
        sexe
        size
        brand
        etat
        type
        tags
        favorite
        composition
        _id
    }
}
`

export const UpdateProduct = gql`
mutation UpdateProduct($data: ProductInput!, $id: ID!) {
    updateProduct(id: $id, data: $data) {
        _id
    }
}
`

export const CreateProduct = gql`
mutation NewProduct($data: ProductInput!) {
  createProduct(data: $data) {
    _id
  }
}
`

export const DeleteProduct = gql`
mutation DeleteProduct($id: ID!) {
  deleteProduct(id: $id) {
    _id
  }
}
`

export const CreateRequest = gql`
mutation CreateRequest($data: RequestInput!) {
  createRequest(data: $data) {
    customer {
      firstName
    }
  }
}
`

export const AllOverview = gql`
query AllOverview {
  allRequest {
    data {
      _id
      _ts
      description
      customer {
        email
        firstName
        lastName
        telephone
        address {
          street
          city
          zipCode
          country
        }
      }
    }
  }
  allOrders {
    data {
      _id
      _ts
      stripeID
      total
      customer {
        email
        firstName
        lastName
        telephone
        address {
          street
          city
          zipCode
          country
        }
      }
      line {
        product
        quantity
      }
    }
  }
}
`

export const CreateOrder = gql`
mutation CreateOrder($data: OrderInput!) {
  createOrder(data: $data) {
    _id
  }
}
`