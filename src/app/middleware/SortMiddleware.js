const SortMiddleware = {
    filterList: function(req, res, next) {

        res.locals.sort = {
            enabled: false,
            field: 'top_seller',
            type: 'desc',
        };
        
        if(req.query.hasOwnProperty('field')) {
            Object.assign(res.locals.sort, {
                enabled: true,
                type: req.query.type || 'desc',
            });
            switch(req.query.field) {
                case 'price': {
                    res.locals.sort.field = 'price';
                    break;
                }
                case 'newest': {
                    res.locals.sort.field = 'createdAt';
                    break;
                }
                case 'top_seller': {
                    res.locals.sort.field = 'top_seller';
                    break;
                }
            }
        };
    
        next();
    }
} 

export default SortMiddleware