import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from "ethers";
import { useEth } from '../../hooks/useEth';
import { Header } from '../header/Header';

export const Indexes = () => {

    let provider = new ethers.providers.EtherscanProvider("ropsten", "KVZDAVRU6H1AZB7SA3Q647K26HSI6PJK3B");

    const daiAddress = "0x4f7f1380239450AAD5af611DB3c3c1bb51049c29";

    const daiAbi = [
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getGroupIds",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_groupId",
                    "type": "uint256"
                }
            ],
            "name": "getGroup",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256[]",
                    "name": "indexes",
                    "type": "uint256[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_indexId",
                    "type": "uint256"
                }
            ],
            "name": "getIndex",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "ethPriceInWei",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "usdPriceInCents",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "usdCapitalization",
                    "type": "uint256"
                },
                {
                    "internalType": "int256",
                    "name": "percentageChange",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];

    const daiContract = new ethers.Contract(daiAddress, daiAbi, provider);
    const [groups, setGroups] = useState([])
    const { loading, request } = useEth()

    const fetchGroups = useCallback(
        async () => {
            const data = await request(daiContract);
            setGroups(data);
            console.log('data', data);

        },
        [request]
    )

    useEffect(() => {
        fetchGroups()
    }, [fetchGroups])

    if (loading) {
        return (<div className={'loading'}><p>Loading...</p></div>)
    }

    return (
        <div>
            <Header></Header>
            <h1>All Indexes</h1>
            {!loading && groups.map((group, idx) => (
                <section
                    key={idx}
                    className={'row mt-40'}
                >
                    <section
                        className={'row'}
                    >
                        <div
                            style={{ width: "100%" }}
                            className={'m-tb0-lr10'}
                        >
                            <h2>{group.name}</h2>
                        </div>
                    </section>

                    <section
                        className={'row'}
                    >
                        {group.indexes.map((item, id) => (
                            <div
                                key={id}
                                className={'column-block'}
                            >
                                <div
                                    className={'card'}
                                >
                                    <h3>{item.name}</h3>
                                    <p className={'price'}>${item.usdPrice} / {item.ethPrice} ETH</p>
                                    <div className={'capitalization'}>
                                        <span>{item.usdCapitalization}</span>
                                        <span className={(item.percentageChange >= 0) ? 'green' : 'red'}>{(item.percentageChange > 0) ? '+' : ''}{item.percentageChange}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                </section>
            ))}
        </div>
    )
}