import db from "./models/index.js";
const Advert = db.Advert;

export async function getAllAdverts() {
    try {
        const adverts = await Advert.findAll();
        return adverts;
    } catch (err) {
        return { error: err, message: 'There was an error fetching all adverts' };
    }
}

export async function addAdvert(newAdvert) {
    try {
        const advert = await Advert.create({
            title: newAdvert.title,
            description: newAdvert.description
        });
        return advert;
    } catch (err) {
        console.error('There was an error processing this request: ', err);
        return { error: err, message: 'There was an error processing this request' };
    }
}

export async function getAdvert(id) {
    try {
        const advert = await Advert.findByPk(id);
        return advert;
    } catch (err) {
        console.error('There was an error processing this request: ', err);
        return { error: err, message: 'There was an error processing this request' };
    }
}

export async function deleteAdvert(id) {
    try {
        await Advert.destroy({
            where: { id }
        });
        return true;
    } catch (err) {
        console.error('There was an error processing this request: ', err);
        return { error: err, message: 'There was an error processing this request' };
    }
}

export async function updateAdvert(id, updatedAdvert) {
    try {
        const advert = await Advert.findByPk(id);
        if (!advert) {
            return { error: 'Advert Not Found' };
        }

        const updated = await advert.update(updatedAdvert, {
            fields: Object.keys(updatedAdvert)
        });

        return updated;
    } catch (err) {
        console.error('There was an error processing this request: ', err);
        return { error: err, message: 'There was an error processing this request' };
    }
}