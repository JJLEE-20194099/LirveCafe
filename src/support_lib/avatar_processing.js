import AvatarGenerator from 'named-avatar-generator';

export const getAvatar = function(req) {
    var avatarUrl = '';
    if (!req.file) {
        const name = req.body.firstname + ' ' + req.body.lastname;
        AvatarGenerator.generate({ name: name, size: 64 }).then(avatar => {
            const path = './src/public/img/' + name + '-default.jpg';
            AvatarGenerator.writeAvatar(avatar, path);
            avatarUrl = '/img/' + name + '-default.jpg';         
        });   
    } else {
        avatarUrl = '/' + req.file.path.split('\\').slice(2).join('/');
        
    }
    return avatarUrl;
}