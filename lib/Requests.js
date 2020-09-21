import { gql } from "graphql-request"


export const AllProducts = gql`
query AllProducts {
    allProducts {
        data {
            name
            image
            quantity
            description
            price
            _id
            category {
                name
                _id
            }
        }
    }
}
`

export const ProductByID = gql`
query ProductByID($id: ID!) {
    findProductByID(id: $id) {
        name
        image
        description
        price
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