import db from "./models/index.js";
const Flair = db.Flair;

export async function getAllFlairs() {
  try {
    return await Flair.findAll();
  } catch (err) {
    throw err;
  }
}

export async function addFlair(newFlair) {
  try {
    return await Flair.create({
      name: newFlair.name,
      color: newFlair.color
    });
  } catch (err) {
    throw err;
  }
}

export async function getFlair(name) {
  try {
    return await Flair.findOne({
      where: { name: name }
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteFlair(name) {
  try {
    return await Flair.destroy({
      where: { name }
    });
  } catch (err) {
    throw err;
  }
}

export async function updateFlair(name, updatedFlair) {
  try {
    const flair = await Flair.findOne({
      where: { name }
    });
    if (!flair) {
      throw new Error("Flair not found");
    }

    return await flair.update(updatedFlair, {
      fields: Object.keys(updatedFlair)
    });
  } catch (err) {
    throw err;
  }
}