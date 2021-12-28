import Workingspace from '../models/Workingspace.js';
import Coffee from '../models/Coffee.js';
import Food from '../models/Food.js';
import User from '../models/User.js';
import { 
    singleMongooseDocumentToObject,
    mongooseDocumentsToObject
} from '../../support_lib/mongoose.js';

const WorkingspaceController = {

    // GET /workingspaces/list

    index(req, res, next) {
        // Workingspace.find({})
        //     .then((workingspaces) => {
        //         res.render('workingspaces/list/list.hbs', {
        //             workingspaces: mongooseDocumentsToObject(workingspaces),
        //             user: res.locals.user
        //         })
        //     }).catch(next);
        
        res.render('workingspaces/list/admin/listEventAdmin.hbs')
        
    },
    
    // GET /workingspaces/:slug
    show(req, res, next) {
        // Workingspace.findOne({slug: req.params.slug})
        //     .then((workingspace) => {
        //         res.render('workingspaces/item/workingspace_info.hbs' , {
        //             workingspace: singleMongooseDocumentToObject(workingspace),
        //             user: res.locals.user
        //         })
        //     }).catch(next)

        res.render('workingspaces/item/event_detail.hbs')
    },

      

    // GET /workingspaces/create
    create(req, res, next) {

        Promise.all([Coffee.find({}), Food.find({}), User.findOne({
                _id: req.signedCookies.userId
            })])
            .then(([coffee, food, user]) => {
               
                coffee = mongooseDocumentsToObject(coffee)
                food = mongooseDocumentsToObject(food)
                var u = '';
                if (user) {
                    u = singleMongooseDocumentToObject(user)
                } else {
                    u = res.locals.user
                }
                
                if (!u) {
                    res.clearCookie("userId");
                    res.render('workingspaces/item/create.hbs', {
                        
                        coffee: coffee,
                        food: food
                    });
                } else {
                    res.render('workingspaces/item/create.hbs', {
                        user: u,
                        
                        coffee: coffee,
                        food: food
                    });
                }

            }).catch(next)
    
    },

    //POST /workingspaces/save
    save(req, res, next) {

        if (!req.body.image || req.body.image == '') {
            req.body.image = "http://www.davidkrugler.com/s/River-Lights-8318.jpg"; 
        }

        
        req.body.image = "http://www.davidkrugler.com/s/River-Lights-8318.jpg"; 
        const workingspace = new Workingspace(req.body);
        console.log(workingspace)
        workingspace.save()
            .then(() => res.send(workingspace))
            .catch(next)
    },

    // GET /workingspaces/:id/edit
    edit(req, res, next) {
        Workingspace.findOne({_id: req.params.id})
            .then((workingspace) => {
                res.render('workingspaces/item/edit.hbs', {
                    workingspace: singleMongooseDocumentToObject(workingspace),
                    user: res.locals.user
                })
            })
            .catch(next)
    },

    // PUT /workingspaces/:id
    update(req, res, next) {
        Workingspace.updateOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next)
    },

    // SOFT DELETE /workingspaces/:id
    softDelete(req, res, next) {
        Workingspace.delete({_id: req.params.id})
        .then(() => res. redirect('back'))
        .catch(next);
    },

    // DEEP DELETE /books/:id/force
    deepDelete(req, res, next) {
        Workingspace.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // RESTORE BOOK (PATCH) /books/:id/restore
    restore(req, res, next) {
        Workingspace.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }


}; 

export default WorkingspaceController;