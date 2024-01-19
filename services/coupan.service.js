const db       = require('../config/db');

module.exports = {
    getAll,
    create,
    update,
    getById,
    delete: _delete,
};

function coupanDetails(coupon) {
    return coupon;
}

async function getAll() {
    const coupanCodes = await db.Coupan.findAll();
    return coupanCodes.map(x => coupanDetails(x));
}

async function create(params) {
    const coupan = new db.Coupan(params);

    await coupan.save();

    return coupanDetails(coupan);
}

async function getById(id) {
    const coupan = await db.Coupan.findByPk(id);
    if (!coupan) throw 'Coupan not found';
    return coupanDetails(coupan);
}

async function update(id, params) {
    const coupan = await getById(id);

    // copy params to user and save
    Object.assign(coupan, params);

    coupan.updated = Date.now();

    await coupan.save()

    return coupanDetails(coupan);
}

async function _delete(id) {
    const coupan = await getById(id);
    await coupan.destroy();
}