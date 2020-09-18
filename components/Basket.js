import { Modal, Text } from "@geist-ui/react";

import Manager from '../lib/CartManager'

export default function Basket({
    bindings
}) {
    if (Manager.numberOfItems == 0) {
        return <Modal {...bindings}>
                    <Modal.Title>Panier</Modal.Title>
                    <Modal.Subtitle>Vide</Modal.Subtitle>
                    <Modal.Content>
                        <Text align="center">Veuillez ajouter quelque chose à votre panier.</Text>
                    </Modal.Content>
                </Modal>
    }
    return <Modal width="80vw" {...bindings}>
        <Modal.Title>Panier</Modal.Title>
        <Modal.Content>
          <p>This is the width I want.</p>
        </Modal.Content>
    </Modal>
}