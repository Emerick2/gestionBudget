const categorie = ["charge fixe", "électricité", "eau", "autre","alimentaire","transport","loisirs"];

/**
 * @param {string} description 
 * @param {string} amount 
 * @param {*} category 
 * @param {*} date (04-03-2026) 
 * @returns boolean
 */
function ValidationData(description, amount, categorie, date){
    if (description.length>200){
        console.log("La description est trop longue");
        return false;
    }
    if (amount <= 0){
        console.log("amount est inférieur à 0.");
        return false;
    }
    let categorieValide = false
    for (let i = 0; i < categorie.length; i++) {
        if (categorie[i] = categorie){
            categorieValide = true;
            break;
        }        
    }
    if (!categorieValide){
        console.log("La catégorie n'est pas valide");
        return false;
    }
    if (date.length < "04-03-2026".length){
        console.log("Date invalide");
        return false;
    }
    return true;
}

module.exports = ValidationData;