import { Modal, useModal, Input, Description, Select, Spacer, Spinner } from "@geist-ui/react";

import { Notification, NotificationCenter } from '@arguiot/broadcast.js'
import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphQLClient } from '../utils/fauna';

const fetcher = async (query) => await graphQLClient.request(query);

export default function ProductForm() {
    const { setVisible, bindings } = useModal()

    const [name, setName] = React.useState()
    const nameHandler = e => {
        setName(e.target.value)
    }

    const [category, setCategory] = React.useState()
    const categoryHandler = e => {
        setCategory(e)
    }
    NotificationCenter.default.addObserver("editProduct", product => {
        setVisible(true)

        setName(product.name)
        setCategory(product.category._id)
    })
    const { data, error } = useSWR(
        gql`
        query AllCategories {
            allCategories {
                data {
                    name
                    _id
                }
            }
        }
        `, fetcher);

    // Components
    const categorySelect = <Select placeholder="Choose one" initialValue={ category } onChange={ categoryHandler } width="100%">
                                {/* {
                                    data.allCategories.data.map(c => {
                                        <Select.Option value={ c._id }>{ c.name }</Select.Option>
                                    })
                                } */}
                            </Select>

    return <Modal {...bindings}>
        <Modal.Title>Produit</Modal.Title>
        <Modal.Content>
            <Description title="Name" content={<Input value={name} width="100%" onChange={nameHandler} placeholder="Name" />} />
            <Spacer y={.8} />
            <Description title="Category" content={categorySelect} />
        </Modal.Content>
        <Modal.Action>Submit</Modal.Action>
    </Modal>
}