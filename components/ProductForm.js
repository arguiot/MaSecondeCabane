import { Modal, useModal, Input, Description, Select, Spacer, Textarea, Image, Display, Row } from "@geist-ui/react";

import { Notification, NotificationCenter } from '@arguiot/broadcast.js'

import { IKUpload, IKContext } from "imagekitio-react"
import styles from "../styles/Dashboard.module.scss"
import { mutate } from "swr";
import { AllProducts, UpdateProduct } from "../lib/Requests";
import { graphQLClient } from "../utils/fauna";

export default function ProductForm() {
    const { setVisible, bindings } = useModal()

    const [id, setID] = React.useState()

    const [name, setName] = React.useState()
    const nameHandler = e => {
        setName(e.target.value)
    }

    const [category, setCategory] = React.useState()
    const categoryHandler = e => {
        setCategory(e)
    }

    const [description, setDesc] = React.useState()
    const descHandler = (e) => {
        setDesc(e.target.value)
    }
    const [image, setImage] = React.useState()
    const updatePicture = res => {
        setImage(res.filePath.substring(1)) // delete first /
    };
    NotificationCenter.default.addObserver("editProduct", product => {
        setVisible(true)

        setID(product._id)

        setName(product.name)
        setCategory(product.category._id)
        setDesc(product.description)
        setImage(product.image)
    })
        
    const onError = err => {
        alert(`Image Upload: ${err}`)
    };

    const [submitDisable, updateSubmit] = React.useState(false)
    const submit = () => {
        updateSubmit(true)
        const query = UpdateProduct
        const variables = {
            id,
            data: {
                name,
                description,
                "price": 15.76,
                "quantity": 4,
                image,
                "category": {
                    "connect": "277227674743603712"
                }
            }
        }
        graphQLClient.request(query, variables).then(data => {
            if (data.updateProduct._id == id) {
                mutate(AllProducts)
                setVisible(false)
            }
        })
    }

    return <Modal {...bindings}>
        <Modal.Title>Produit</Modal.Title>
        <Modal.Content className={styles.productForm}>
            <Display shadow caption="Image miniature">
                <Image src={ `https://ik.imagekit.io/ittx2e0v7x/tr:n-media_library_thumbnail/${image}` } width={ 150 } height={150}/>
            </Display>
            <Row justify="center" width="100%">
                <IKContext 
                        publicKey="public_eJkpjNUfd/gm7cI1cWR6OEPz6GQ="
                        urlEndpoint="https://ik.imagekit.io/ittx2e0v7x"
                        transformationPosition="path"
                        authenticationEndpoint="/api/imagekit">
                    <IKUpload fileName={ name } onError={onError} onSuccess={updatePicture} className={ styles.imageInput }/>
                </IKContext>
            </Row>

            <Description title="Name" content={<Input value={name} width="100%" onChange={nameHandler} placeholder="Name" />} />
            <Spacer y={.8} />
            {/* <Description title="Category" content={categorySelect} /> */}
            <Spacer y={.8} />
            <Description title="Description" content={<Textarea width="100%"
            value={description}
            onChange={descHandler}
            placeholder="Description" />} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action onClick={ submit } disabled={submitDisable}>Submit</Modal.Action>
    </Modal>
}