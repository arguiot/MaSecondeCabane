import {
    Badge
} from '@geist-ui/react';
import Lottie from 'react-lottie';
import animationData from '../lotties/add-to-cart.json';
import React from 'react';
import Manager from '../lib/CartManager'

class Animation extends React.Component {
    constructor({ className }) {
        super(...arguments);
        this.className = className
    }
    get defaultOptions() {
        return {
            loop: false,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
            },
        };
    }
    render() {
        return (
            <div className={this.className}>
                <Badge.Anchor placement="topRight">
                    {Manager.numberOfItems > 0 &&
                        <Badge size="mini">{Manager.numberOfItems}</Badge>
                    }
                    {
                        Manager.numberOfItems == 0 ? <img src="/bag.svg" width={32} height={32} alt="Panier" /> : <Lottie options={this.defaultOptions} height={32} width={32} isClickToPauseDisabled={true} />
                    }
                </Badge.Anchor>
            </div>
        );
    }
}

export default Animation