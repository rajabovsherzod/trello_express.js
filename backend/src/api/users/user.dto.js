export class UserDto {
    id;
    email;
    username;

    constructor(userModel){
        this.id = userModel._id,
        this.email = userModel.email,
        this.username = userModel.username
    }
}