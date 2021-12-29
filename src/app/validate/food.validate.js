const validate = {
    postCreateFood: function(req, res, next) {
        const errors = [];
        
        if (!req.body.name) {
            errors.push("Name is required")
        }


        if (!req.body.description) {
            errors.push("Description is required")
        }

        if (!req.file) {
            errors.push("Image is required")
        }
        if (!req.body.price) {
            errors.push("Price is required")
        }

        if (errors.length) {
            res.render('own/food/item/create.hbs', {
                errors: errors,
                values: req.body
            }) 
            return ;
        }
        next();
    }
}

export default validate;