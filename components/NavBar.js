import styles from '../styles/NavBar.module.scss'
import { Link, Text } from '@geist-ui/react'
import NextLink from 'next/link'
import Cart from './Cart'
function NavBar() {
    const [state, setState] = React.useState(false)
    const toggle = () => setState(state => !state)
    const close = () => this.setState(() => false)
    const menuToggleClass = [styles.menuToggle, state ? styles.cross : ""].join(" ")

    return <div className={ styles.nav }>
                <Link href="/"><a className={ styles.logo }></a></Link>
                <div className={ styles.menuContainer } style={{ display: state ? "flex" : "none" }}>
                    <NextLink href="/">
                        <Text b><Link underline onClick={ close }>About</Link></Text>
                    </NextLink>
                    <NextLink href="/">
                        <Text b><Link underline onClick={ close }>Products</Link></Text>
                    </NextLink>
                    <NextLink href="/">
                        <Text b><Link underline onClick={ close }>Other</Link></Text>
                    </NextLink>
                </div>
                <Cart isStopped={ true } className={ styles.cart } />
                <div className={ menuToggleClass } onClick={ toggle }>
                    <div className={ styles.l }></div>
                    <div className={ styles.l }></div>
                    <div className={ styles.l }></div>
                </div>
            </div>
}

export default NavBar