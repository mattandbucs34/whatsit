import Advert from "./models";

module.exports = {

    async getAllAdverts() {
        try {
            const adverts = await Advert.findAll();
            return adverts;
        } catch (err) {
            return { error: err, message: 'There was an error fetching all adverts' };
        }
    },

    async addAdvert(newAdvert) {
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
    },

    async getAdvert(id) {
        try {
            const advert = await Advert.findById(id);
            return advert;
        } catch (err) {
            console.error('There was an error processing this request: ', err);
            return { error: err, message: 'There was an error processing this request' };
        }
    },

    async deleteAdvert(id) {
        try {
            await Advert.destroy({
                where: { id }
            });
            return true;
        } catch (err) {
            console.error('There was an error processing this request: ', err);
            return { error: err, message: 'There was an error processing this request' };
        }
    },

    async updateAdvert(id, updatedAdvert) {
        const advert = Advert.findById(id);
        if (!advert) {
            return { error: 'Advert Not Found' };
        }

        try {
            const updated = await advert.update(updatedAdvert, {
                fields: Object.keys(updatedAdvert)
            });

            return updated;
        } catch (err) {
            console.error('There was an error processing this request: ', err);
            return { error: err, message: 'There was an error processing this request' };
        }
    }
};