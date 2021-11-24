export default function SortMiddleware (req, res, next) {

    res.locals.sort = {
        enabled: false,
        field: 'default',
        type: 'desc',
    };

    if(req.query.hasOwnProperty('sort')) {
        Object.assign(res.locals.sort, {
            enabled: true,
            type: req.query.type || 'desc',
        });
        switch(req.query.sort) {
            case 'price': {
                res.locals.sort.field = 'price';
                break;
            }
            case 'newest': {
                res.locals.sort.field = 'createdAt';
                break;
            }
            case 'top_seller': {
                res.locals.sort.field = 'sold';
                break;
            }
        }
    };

    next();
}