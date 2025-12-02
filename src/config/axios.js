import axios from "axios";

        const clienteAxios=axios.create({
            baseURL:"https://rest-mongodb-18rp.onrender.com/"
        })

        export default clienteAxios