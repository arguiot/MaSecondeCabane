import styles from '../styles/NavBar.module.scss'
import { Link, Text, useModal } from '@geist-ui/react'
import NextLink from 'next/link'
import Cart from './Cart'
import Basket from './Basket'
import { NotificationCenter } from '@arguiot/broadcast.js'
import { useSession } from 'next-auth/client'

function NavBar() {
    const [state, setState] = React.useState(false)
    const toggle = () => setState(state => !state)
    const close = () => setState(false)
    const menuToggleClass = [styles.menuToggle, state ? styles.cross : ""].join(" ")
    const { setVisible, bindings } = useModal()
    // Next Auth
    const [ session, loading ] = useSession()

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "NavBar")
    return <div className={ styles.nav }>
                <NextLink href="/"><div className={ styles.logo }></div></NextLink>
                <div className={ styles.menuContainer } style={{ display: state ? "flex" : "none" }}>
                    <NextLink href="/about">
                        <Text b><Link underline onClick={ close }>À propos</Link></Text>
                    </NextLink>
                    <NextLink href="/product/all?gender=Fille">
                        <Text b><Link underline onClick={ close }>Filles</Link></Text>
                    </NextLink>
                    <NextLink href="/product/all?gender=Garçon">
                        <Text b><Link underline onClick={ close }>Garçons</Link></Text>
                    </NextLink>
                    <NextLink href="/">
                        <Text b type="success"><Link underline onClick={ close }>Vendre</Link></Text>
                    </NextLink>
                    {session && <NextLink href="/dashboard">
                        <Text b><Link underline onClick={ close }>Dashboard</Link></Text>
                    </NextLink>}
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