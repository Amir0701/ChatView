export class UserAuthDto {

    name = '';
    nickname = '';
    email = '';
    password = '';

    constructor(name, nickname, email, password) {
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }

}