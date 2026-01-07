import * as AdvertQueries from "../db/queries.adverts.js";

export async function index(req, res, next) {
    const adverts = await AdvertQueries.getAllAdverts();
    if (adverts.error) {
        res.redirect(500, "static/index");
    } else {
        res.render("adverts/index", { adverts });
    }
}

export function newAdvert(req, res, next) {
    res.render("adverts/new");
}

export async function createAdvert(req, res, next) {
    let newAdvert = {
        title: req.body.title,
        description: req.body.description
    };

    const response = await AdvertQueries.addAdvert(newAdvert);
    if (response.error) {
        res.redirect(500, "/adverts/new");
    } else {
        res.redirect(303, `/adverts/${response.id}`);
    }
}

export async function showAdvert(req, res, next) {
    const advert = await AdvertQueries.getAdvert(req.params.id);
    if (!advert || advert.error) {
        res.redirect(404, "/");
    } else {
        res.render("adverts/show", { advert });
    }
}

export async function destroyAdvert(req, res, next) {
    const response = await AdvertQueries.deleteAdvert(req.params.id);

    if (response.error) {
        res.redirect(500, `/adverts/${req.params.id}`);
    } else {
        res.redirect(303, "/adverts");
    }
}

export async function editAdvert(req, res, next) {
    const advert = await AdvertQueries.getAdvert(req.params.id);

    if (!advert || advert.error) {
        res.redirect(404, "/");
    } else {
        res.render("adverts/edit", { advert });
    }
}

export async function updateAdvert(req, res, next) {
    const advert = await AdvertQueries.updateAdvert(req.params.id, req.body);

    if (!advert || advert.error) {
        res.redirect(404, `/adverts/${req.params.id}/edit`);
    } else {
        res.redirect(303, `/adverts/${advert.id}`);
    }
}
