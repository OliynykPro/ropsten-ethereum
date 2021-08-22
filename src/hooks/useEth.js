import { useCallback, useState } from 'react'

function sleep() {
    return new Promise(resolve => setTimeout((resolve), 300));
}

export const useEth = () => {
    const [loading, setLoading] = useState(false)
    console.log('use eth');
    const request = useCallback(
        async (daiContract) => {
            console.log('start');
            setLoading(true)

            const currencyFormatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            let groups = [];

            let getIndx = async (group) => {
                console.log(group);
                // group.indexes.forEach((item, index) => {
                for (let index = 0; index < group.indexes.length; index++) {
                    // setTimeout(() => {
                    // GET EACH ITEM INFO (ITEM NAME, PRICE, etc.)
                    daiContract.getIndex(group.indexes[index].id).then((result) => {
                        console.log(result);
                        group.indexes[index].name = result.name;
                        group.indexes[index].percentageChange = parseInt(result.percentageChange._hex, 16);
                        group.indexes[index].ethPrice = parseInt(result.ethPriceInWei._hex, 16) / 1000000000000000000;
                        group.indexes[index].usdPrice = parseInt(result.usdPriceInCents._hex, 16) / 100;
                        group.indexes[index].usdCapitalization = currencyFormatter.format(parseInt(result.usdCapitalization._hex, 16));
                        console.log(group.indexes[index]);
                    })
                    await sleep();
                }
                // }, index * 1000)
                // })
            }

            const result = await daiContract.getGroupIds();

            // result.forEach((id, index) => {
            for (let index = 0; index < result.length; index++) {
                //GET GROUP (NAME + IDS OF GROUP ITEMS)
                var daiGroup = await daiContract.getGroup(result[index]._hex);

                let group = {
                    name: daiGroup[0],
                    id: result[index]._hex,
                    indexes: daiGroup[1].map((index) => ({ id: index._hex }))
                };

                groups.push(group);
                // setGroups(groups);

                await getIndx(group)
                if (index === result.length - 1) {
                    console.log('loading false');
                    setLoading(false)
                }
            }
            // });

            return groups;
        },
        []
    )

    return { loading, request }
}