import { useCallback, useState } from 'react'

function sleep() {
    return new Promise(resolve => setTimeout((resolve), 300));
}

export const useEth = () => {
    const [loading, setLoading] = useState(false)
    const request = useCallback(
        async (daiContract) => {
            setLoading(true)

            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            let groups = [];

            let getIndx = async (group) => {
                for (let index = 0; index < group.indexes.length; index++) {
                    daiContract.getIndex(group.indexes[index].id).then((result) => {
                        group.indexes[index].name = result.name;
                        group.indexes[index].percentageChange = parseInt(result.percentageChange._hex, 16);
                        group.indexes[index].ethPrice = parseInt(result.ethPriceInWei._hex, 16) / 1000000000000000000;
                        group.indexes[index].usdPrice = parseInt(result.usdPriceInCents._hex, 16) / 100;
                        group.indexes[index].usdCapitalization = currencyFormatter.format(parseInt(result.usdCapitalization._hex, 16));
                    })
                    await sleep();
                }
            }

            const result = await daiContract.getGroupIds();

            for (let index = 0; index < result.length; index++) {
                var daiGroup = await daiContract.getGroup(result[index]._hex);

                let group = {
                    name: daiGroup[0],
                    id: result[index]._hex,
                    indexes: daiGroup[1].map((index) => ({ id: index._hex }))
                };

                groups.push(group);

                await getIndx(group)
                if (index === result.length - 1) {
                    setLoading(false)
                }
            }

            return groups;
        },
        []
    )

    return { loading, request }
}