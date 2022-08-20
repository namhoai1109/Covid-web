const Package = require("../models/Package");
const Product = require("../models/Product");
const Patient = require("../models/Patient");

const validatePackage = (package) => {
    if (!package.name) {
        return {
            result: false,
            message: "Name is required",
        };
    }
    if (!package.products) {
        return {
            result: false,
            message: "Products are required",
        };
    }
    if (package.products.length < 2) {
        return {
            result: false,
            message: `Number of products must be at least 2`,
        };
    }

    return {
        result: true,
        message: "",
    };
};

exports.getAllPackages = async(req, res) => {
    try {
        const sortBy = req.query.sort_by || "name";
        const sortOrder = req.query.sort_order || "asc";
        let packages;
        const timeConversion = {
            day: 1,
            week: 7,
            month: 30,
        };
        if (sortBy === "time_limit") {
            packages = await Package.aggregate([{
                    $unwind: "$products",
                },
                {
                    $lookup: {
                        from: Product.collection.name,
                        localField: "products.product",
                        foreignField: "_id",
                        as: "products.product",
                    },
                },
                {
                    $unwind: "$products.product",
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        time_limit: { $first: "$time_limit" },
                        limit_per_patient: { $first: "$limit_per_patient" },
                        products: { $push: "$products" },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        time_limit: 1,
                        limit_per_patient: 1,
                        products: 1,
                        time_in_days: {
                            $cond: {
                                if: { $eq: ["$time_limit.unit", "day"] },
                                then: "$time_limit.value",
                                else: {
                                    $cond: {
                                        if: {
                                            $eq: ["$time_limit.unit", "week"],
                                        },
                                        then: {
                                            $multiply: ["$time_limit.value", 7],
                                        },
                                        else: {
                                            $multiply: [
                                                "$time_limit.value",
                                                30,
                                            ],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    $sort: {
                        time_in_days: sortOrder === "asc" ? 1 : -1,
                    },
                },
            ]);
        } else {
            packages = await Package.find()
                .sort({
                    [sortBy]: sortOrder })
                .populate("products.product")
                .exec();
        }

        res.status(200).send(packages);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.searchPackages = async(req, res) => {
    try {
        const queryValue = decodeURI(req.query.value);
        const re = new RegExp(queryValue, "i");
        const packages = await Package.aggregate([{
                $unwind: "$products",
            },
            {
                $lookup: {
                    from: Product.collection.name,
                    localField: "products.product",
                    foreignField: "_id",
                    as: "products.product",
                },
            },
            {
                $unwind: "$products.product",
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    time_limit: { $first: "$time_limit" },
                    limit_per_patient: { $first: "$limit_per_patient" },
                    products: {
                        $push: "$products",
                    },
                },
            },
            {
                $addFields: {
                    time_value: {
                        $toString: "$time_limit.value",
                    },
                    time_unit: {
                        $toString: "$time_limit.unit",
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    time_limit: 1,
                    limit_per_patient: 1,
                    products: 1,
                    time_formatted: {
                        $concat: ["$time_value", " ", "$time_unit"],
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { "products.product.name": { $regex: re } },
                        { "products.product.type": { $regex: re } },
                        { "products.product.quantity_unit": { $regex: re } },
                        { name: { $regex: re } },
                        { "time_limit.unit": { $regex: re } },
                        { time_formatted: { $regex: re } },
                    ],
                },
            },
        ]).exec();

        res.status(200).send(packages);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.filterPackages = async(req, res) => {
    try {
        const queryValue = decodeURI(req.query.value);
        const re = new RegExp(queryValue, "i");
        if (req.query.filter_by === "time_limit") {
            packages = await Package.find({
                    "time_limit.unit": { $regex: re },
                })
                .populate("products.product")
                .sort({ name: "asc" })
                .exec();
        } else {
            packages = await Package.find({
                    [req.query.filter_by]: { $regex: re },
                })
                .populate("products.product")
                .sort({ name: "asc" })
                .exec();
        }

        res.status(200).send(packages);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.registerPackage = async(req, res) => {
    try {
        const validation = validatePackage(req.body);
        if (!validation.result) {
            return res.status(400).send({ message: validation.message });
        }

        const package = new Package({
            name: req.body.name,
            time_limit: req.body.time_limit,
            limit_per_patient: req.body.limit_per_patient,
            products: req.body.products,
        });

        await package.save();
        res.status(200).send({ message: "Package registered successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updatePackage = async(req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).send({ message: "Package not found" });
        }

        const validation = validatePackage(req.body);
        if (!validation.result) {
            return res.status(400).send({ message: validation.message });
        }

        package.name = req.body.name;
        package.time_limit = req.body.time_limit;
        package.limit_per_patient = req.body.limit_per_patient;
        package.products = req.body.products;

        await package.save();
        res.status(200).send({ message: "Package updated successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deletePackage = async(req, res) => {
    try {
        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).send({ message: "Package not found" });
        }
        await package.remove();
        res.status(200).send({ message: "Package deleted successfully" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};