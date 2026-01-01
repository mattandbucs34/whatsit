import { getAllAdverts, addAdvert, getAdvert, deleteAdvert, updateAdvert } from "../db/queries.adverts.js";

export async function index(req, res, next) {
    const response = await getAllAdverts();
    if (response.error) {
        res.redirect(500, "static/index");
    } else {
        res.render("adverts/index", { response });
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


    const response = await addAdvert(newAdvert);
    if (response.error) {
        res.redirect(500, "/adverts/new");
    } else {
        res.redirect(303, `/adverts/${advert.id}`);
    }
}

export async function showAdvert(req, res, next) {
    const response = await getAdvert(req.params.id);
    if (response.error) {
        res.redirect(404, "/");
    } else {
        res.render("adverts/show", { response });
    }
}

export async function destroyAdvert(req, res, next) {
    const response = await deleteAdvert(req.params.id);

    if (response.error) {
        res.redirect(500, `/adverts/${advert.id}`);
    } else {
        res.redirect(303, "/adverts");
    }
}

export async function editAdvert(req, res, next) {
    const response = await getAdvert(req.params.id);

    if (response.error) {
        res.redirect(404, "/");
    } else {
        res.render("adverts/edit", { response });
    }
}

export async function updateAdvert(req, res, next) {
    const response = await updateAdvert(req.params.id, req.body);

    if (response.error || !response) {
        res.redirect(404, `/adverts/${req.params.id}/edit`);
    } else {
        res.redirect(`/adverts/${advert.id}`);
    }
}