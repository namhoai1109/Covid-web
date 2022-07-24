const Facility = require("../models/Facility");
// Create facility
exports.createFacility = async(req, res) => {
    const facility = new Facility({
        name: req.body.name,
        capacity: req.body.capacity,
        current_count: req.body.current_count,
    });

    try {
        await facility.save();
        res.status(200).send({ message: "Facility created successfully" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}