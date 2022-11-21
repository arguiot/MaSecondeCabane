import { Notification, NotificationCenter } from "@arguiot/broadcast.js";
import { useState,useEffect } from "react";
import { useRouter } from 'next/router'
import Locales from "../locales/NavBar";
import { useConfig } from "../pages/_app";
export default function Promo() {
    const [show, setShow] = useState(true);
    // const [counter, setCounter] = useState("00d 00h 00m 00s");
    
    // function remainingTime() {
    //     const now = new Date();
    //     const end = new Date(2022, 1, 1);
    //     const diff = end.getTime() - now.getTime();
    //     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    //     // Make sure we have two digits for each
    //     const d = days.toString().padStart(2, "0");
    //     const h = hours.toString().padStart(2, "0");
    //     const m = minutes.toString().padStart(2, "0");
    //     const s = seconds.toString().padStart(2, "0");
    //     setCounter(`${d}d ${h}h ${m}m ${s}s`);
    // }
    
    useEffect(() => {
        NotificationCenter.default.post(new Notification("promo", show))
        // const interval = setInterval(() => {
        //     remainingTime();
        // }, 100);
        // return () => clearInterval(interval);
    }, []);

    const router = useRouter()
    const config = useConfig()

    const promoText = (config.promo[router.locale.split("-")[0]] || config.promo.en).replace("XX", config.freeShipping)

    return <>
    { show && <div className="promo">
        <style jsx>{`
            .promo {
                background-color: #007577;
                height: 40px;
                width: 100vw;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 100;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                text-align: center;
            }
            .x-button {
                background-color: transparent;
                border: none;
                width: 40px;
                transform: scale(1.5) translateY(-2.5%);
            }

            @media (max-width: 600px) {
                .promo {
                    font-size: 0.8em;
                }
            }
        `}</style>
        <span>{ promoText }</span>
        <button className="x-button" onClick={() => { setShow(false); NotificationCenter.default.post(new Notification("promo", false)) }}>&times;</button>
    </div>}
    </>
}
