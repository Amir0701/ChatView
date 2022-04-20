import {apiUrl} from "@/services/config";
import axios from "axios";

export default {
    user:{
        resourceUrl: "user",
        getUser(id){
            return axios({
                url: `${apiUrl}/${this.resourceUrl}/${id}`,
                method: "GET"
            });
        },
        add(user) {
            return axios({
                url: `${apiUrl}/${this.resourceUrl}`,
                method: "POST",
                data: user
            });
        },
        delete(id){
            return axios({
                url: `${apiUrl}/${this.resourceUrl}/${id}`,
                method: "DELETE"
            });
        },
        edit(id, user){
            return axios({
                url: `${apiUrl}/${this.resourceUrl}/${id}`,
                method: "PUT",
                data: user
            });
        }
    }
}