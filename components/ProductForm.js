import { Modal, useModal, Input, Description, Select, Spacer, Textarea, Image, Display, Row, Text } from "@geist-ui/react";

import { Notification, NotificationCenter } from '@arguiot/broadcast.js'

import { IKUpload, IKContext } from "imagekitio-react"
import styles from "../styles/Dashboard.module.scss"
import { mutate } from "swr";
import { AllProducts, CreateProduct, UpdateProduct, DeleteProduct } from "../lib/Requests";
import { graphQLClient } from "../utils/fauna";
import TagsInput from "./TagsInput";

export default function ProductForm() {
    const { setVisible, bindings } = useModal()
    const [type, setType] = React.useState(0)
    const [id, setID] = React.useState(null)

    const [name, setName] = React.useState()
    const nameHandler = e => {
        setName(e.target.value)
    }

    const [description, setDesc] = React.useState()
    const descHandler = (e) => {
        setDesc(e.target.value)
    }

    const [price, setPrice] = React.useState(0)
    const priceHandler = e => {
        setPrice(parseFloat(e.target.value))
    }
    const [quantity, setQuantity] = React.useState(1)
    const quantityHandler = e => {
        setQuantity(parseInt(e.target.value))
    }
    const [creation, setCreation] = React.useState(+ new Date())
    const [image, setImage] = React.useState()
    const updatePicture = res => {
        setImage(res.filePath.substring(1)) // delete first /
    };

    const [sexe, setSexe] = React.useState("Fille")
    const [size, setSize] = React.useState("1 ans")
    const sizeList = [
        "0 mois", "1 mois", "3 mois", "6 mois", "9 mois", "12 mois", "18 mois",
        "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "7 ans", "8 ans", "9 ans", "10 ans", "11 ans", "12 ans"
    ]
    const [brand, setBrand] = React.useState("Inconnue")
    const [etat, setEtat] = React.useState("Bon")
    const [tags, setTags] = React.useState([])

    NotificationCenter.default.addObserver("newProduct", () => {
        setVisible(true)
        setType(0)
        updateSubmit(false)

        setID(null)

        setName()
        setDesc()
        setImage()
        setPrice()
        setQuantity(1)
        setCreation(+ new Date())
        setSexe("Fille")
        setSize("1 ans")
        setBrand("Inconnue")
        setEtat("Bon")
        setTags([])
    })

    NotificationCenter.default.addObserver("deleteProduct", product => {
        setVisible(true)
        setType(1)
        updateSubmit(false)

        setID(product._id)
    })

    NotificationCenter.default.addObserver("editProduct", product => {
        setVisible(true)
        setType(0)
        updateSubmit(false)

        setID(product._id)

        setName(product.name)
        setDesc(product.description)
        setImage(product.image)
        setPrice(product.price)
        setQuantity(product.quantity)
        setCreation(product.creation)
        setSexe(product.sexe)
        setSize(product.size)
        setBrand(product.brand)
        setEtat(product.etat)
        setTags(product.tags)
    })
        
    const onError = err => {
        alert(`Image Upload: ${JSON.stringify(err)}`)
    };

    const [submitDisable, updateSubmit] = React.useState(false)
    const submit = () => {
        updateSubmit(true)
        const data = {
            name,
            description,
            price,
            quantity,
            image,
            creation,
            sexe,
            size,
            brand,
            etat,
            tags
        }
        if (id == null) {
            const query = CreateProduct
            graphQLClient.request(query, { data }).then(data => {
                if (typeof data.createProduct._id != "undefined") {
                    mutate(AllProducts)
                    setVisible(false)
                } else {
                    alert(`Erreur\n${JSON.stringify(data)}`)
                }
            })
        } else {
            const query = UpdateProduct
            const variables = {
                id,
                data
            }
            graphQLClient.request(query, variables).then(data => {
                if (data.updateProduct._id == id) {
                    mutate(AllProducts)
                    setVisible(false)
                } else {
                    alert(`Erreur\n${JSON.stringify(data)}`)
                }
            })
        }
    }
    const remove = () => {
        updateSubmit(true)
        const query = DeleteProduct
        graphQLClient.request(query, { id }).then(data => {
            if (typeof data.deleteProduct._id != "undefined") {
                mutate(AllProducts)
                setVisible(false)
            } else {
                alert(`Erreur\n${JSON.stringify(data)}`)
            }
        })
    }

    const edit = <Modal {...bindings}>
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
                    <IKUpload fileName={ typeof name == "undefined" ? "newProd" : name } onError={onError} onSuccess={updatePicture} className={ styles.imageInput }/>
                </IKContext>
            </Row>

            <Description title="Nom" content={<Input value={name} width="100%" onChange={nameHandler} placeholder="Name" />} />
            <Spacer y={.8} />
            {/* <Description title="Category" content={categorySelect} /> */}
            <Spacer y={.8} />
            <Description title="Description" content={<Textarea width="100%"
            value={description}
            onChange={descHandler}
            placeholder="Description" />} />
            <Spacer y={.8} />
            <Description title="Prix" content={<Input value={price} width="100%" onChange={priceHandler} placeholder="Prix" type="number" />} />
            <Spacer y={.8} />
            <Description title="Quantité" content={<Input value={quantity} width="100%" onChange={quantityHandler} placeholder="Quantité" type="number" />} />
            <Spacer y={.8} />
            <Description title="Sexe" content={
                <Select placeholder="Sexe" value={sexe} onChange={setSexe} width="100%">
                    <Select.Option value="Fille">Fille</Select.Option>
                    <Select.Option value="Garçon">Garçon</Select.Option>
                </Select>
            }/>
            <Spacer y={.8} />
            <Description title="Taille" content={
                <Select placeholder="Taille" value={size} onChange={setSize} width="100%">
                    {
                        sizeList.map(s => <Select.Option value={s}>{s}</Select.Option>)
                    }
                </Select>
            }/>
            <Spacer y={.8} />
            <Description title="Marque" content={<Input value={brand} width="100%" onChange={e => setBrand(e.target.value)} placeholder="Marque" />} />
            <Spacer y={.8} />
            <Description title="État" content={
                <Select placeholder="État" value={etat} onChange={setEtat} width="100%">
                    <Select.Option value="Bon">Très bon état</Select.Option>
                    <Select.Option value="Excellent">Excellent état</Select.Option>
                    <Select.Option value="Neuf">Neuf</Select.Option>
                </Select>
            }/>
            <Spacer y={.8} />
            <Description title="Tags" content={<TagsInput value={tags} onChange={ setTags } />} />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Annuler</Modal.Action>
        <Modal.Action onClick={ submit } loading={submitDisable}>Enregistrer</Modal.Action>
    </Modal>

    const _delete = <Modal {...bindings}>
        <Modal.Title>Supprimer</Modal.Title>
        <Modal.Subtitle>Voulez-vous vraiment supprimer le produit?</Modal.Subtitle>
        <Modal.Action passive onClick={() => setVisible(false)}>Annuler</Modal.Action>
        <Modal.Action onClick={ remove } loading={submitDisable}><Text type="error">Supprimer</Text></Modal.Action>
    </Modal>
    return type == 0 ? edit : _delete
}