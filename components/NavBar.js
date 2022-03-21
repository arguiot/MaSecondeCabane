import styles from '../styles/NavBar.module.scss'
import { Link, Text, useModal } from '@geist-ui/react'
import NextLink from 'next/link'

import dynamic from 'next/dynamic'
import { NotificationCenter } from '@arguiot/broadcast.js'
import { useRouter } from 'next/router'
import Locales from "../locales/NavBar"
import React from "react";

const Basket = dynamic(() => import('./Basket'))
const Cart = dynamic(() => import('./Cart'))

function NavBar() {
    const [state, setState] = React.useState(false)
    const [promo, setPromo] = React.useState(false)
    const toggle = () => setState(state => !state)
    const close = () => setState(false)
    const menuToggleClass = [styles.menuToggle, state ? styles.cross : ""].join(" ")
    const { setVisible, bindings } = useModal()

    const [small, setSmall] = React.useState(false)
    React.useEffect(() => {
        window.onscroll = () => {
            const y = document.documentElement.scrollTop || document.body.scrollTop
            if (y >= 100) {
                setSmall(true)
            } else if (y < 100) {
                setSmall(false)
            }
        }
    }, [])

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    NotificationCenter.default.addObserver("newItem", data => {
        forceUpdate()
    }, "NavBar")
    NotificationCenter.default.addObserver("promo", data => {
        setPromo(data)
    }, "NavBar")
    const router = useRouter()
    const t = Object.fromEntries(Object.entries(Locales).map(line => [
		line[0],
		line[1][router.locale.split("-")[0]]
    ]))
    
    return <div className={ [styles.nav, small ? styles.small : ""].join(" ") } style={{ transform: (promo && !small) ? "translateY(40px)" : "" }}>
                <NextLink href="/"><div className={ styles.logo }></div></NextLink>
                <div className={ styles.menuContainer } style={{ display: state ? "flex" : "none" }}>
                    <NextLink href="/product/all?gender=Fille">
                        <Text b><Link underline onClick={ close }>{ t.girl }</Link></Text>
                    </NextLink>
                    <NextLink href="/product/all?gender=Garçon">
                        <Text b><Link underline onClick={ close }>{ t.boys }</Link></Text>
                    </NextLink>
                    <NextLink href="/product/sell">
                        <Text b><Link underline block onClick={ close } className={ styles.sell }>{ t.sell }</Link></Text>
                    </NextLink>
                    <NextLink href="/about">
                        <Text b><Link underline onClick={ close }>{ t.about }</Link></Text>
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