import styles from '../styles/NavBar.module.scss'
import { Link, Text, useModal } from '@geist-ui/react'
import NextLink from 'next/link'

import dynamic from 'next/dynamic'
import { NotificationCenter } from '@arguiot/broadcast.js'

const Basket = dynamic(() => import('./Basket'))
const Cart = dynamic(() => import('./Cart'))

function NavBar() {
    const [state, setState] = React.useState(false)
    const toggle = () => setState(state => !state)
    const close = () => setState(false)
    const menuToggleClass = [styles.menuToggle, state ? styles.cross : ""].join(" ")
    const { setVisible, bindings } = useModal()

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "NavBar")
    return <div className={ styles.nav }>
                <NextLink href="/"><div className={ styles.logo }></div></NextLink>
                <div className={ styles.menuContainer } style={{ display: state ? "flex" : "none" }}>
                    <NextLink href="/product/all?gender=Fille">
                        <Text b><Link underline onClick={ close }>Filles</Link></Text>
                    </NextLink>
                    <NextLink href="/product/all?gender=Garçon">
                        <Text b><Link underline onClick={ close }>Garçons</Link></Text>
                    </NextLink>
                    <NextLink href="/product/sell">
                        <Text b><Link underline block onClick={ close } className={ styles.sell }>Vendre</Link></Text>
                    </NextLink>
                    <NextLink href="/about">
                        <Text b><Link underline onClick={ close }>À propos</Link></Text>
                    </NextLink>
                </div>
                <div onClick={ e => { 
                    setVisible(true); 
                } }>
                    <Cart className={ styles.cart } />
                </div>
                <div className={ menuToggleClass } onClick={ toggle }>
                    <div className={ styles.l }></div>
                    <div className={ styles.l }></div>
                    <div className={ styles.l }></div>
                </div>

                <Basket bindings={ bindings } />
            </div>
}

export default NavBar