const validate = {
    postCreatePromo: function(req, res, next) {
        const errors = [];

        if (!req.body.discountPercentage && !req.body.discountAmount) {
            errors.push("Discount Percentage Or Discount Amount is required");
        }

        if (!req.body.condition) {
            errors.push("Condition of Promotion is required");
        }

        if (!req.body.description) {
            errors.push("Description of Promotion is required");
        }

        if (!req.body.expirationDate) {
            errors.push("Expiration Date is required");
        }

        if (errors.length) {
            res.render('own/promos/item/create.hbs', {
                errors: errors,
                values: req.body
            }) 
            return ;
            
        }
        next();

    }
}

export default validate;