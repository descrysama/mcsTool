const compareBoth = (mobiArray, utopyaArray) => {
    const mergedArray = [];
    const processedIds = [];
    console.log(mobiArray)
    console.log(utopyaArray)
    // Fonction pour vérifier si un id_product a déjà été traité
    const isProcessed = (id) => {
        return processedIds.includes(id);
    };
    // Parcourir le mobiArray et pousser les objets dans le tableau résultant
    mobiArray.forEach(item => {
        const idProduct = item.id_product;
        if(!isProcessed(idProduct)) {
            mergedArray.push(item);
            processedIds.push(item.id_product);
        } else {
            const existingIndex = mergedArray.findIndex(obj => obj.id_product === idProduct);
            if (existingIndex !== -1) {
                const existingItem = mergedArray[existingIndex];
                if (existingItem.quantity === 0 && item.quantity > 0) {
                    mergedArray[existingIndex] = item
                } else if (item.quantity !== 0 && item.wholesale_price < existingItem.wholesale_price) {
                    mergedArray[existingIndex] = item
                }
            }
        }
        
    });
    utopyaArray.forEach(item => {
        const idProduct = item.id_product;
        if (!isProcessed(idProduct)) {
            mergedArray.push(item);
            processedIds.push(idProduct);
        } else {
            const existingIndex = mergedArray.findIndex(obj => obj.id_product === idProduct);
            if (existingIndex !== -1) {
                const existingItem = mergedArray[existingIndex];
                if (existingItem.quantity === 0 && item.quantity > 0) {
                    mergedArray[existingIndex] = item
                } else if (item.quantity !== 0 && item.wholesale_price < existingItem.wholesale_price) {
                    mergedArray[existingIndex] = item
                } else if (item.quantity === existingItem.quantity && item.wholesale_price < existingItem.wholesale_price) {
                    mergedArray[existingIndex] = item
                }
            }
        }
    });

    return mergedArray;
}

module.exports = {
    compareBoth
}