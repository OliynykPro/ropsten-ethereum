import React from 'react';
import '../header/Header.css';

export function Header() {
    return (
        <div
            className={'header'}
        >
            <div
                className={'logo'}>
                Logotype
            </div>
            <div>
                <a className={'button'}>Connect wallet</a>
            </div>
        </div>
    )
}
