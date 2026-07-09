import instance from "../lib/axios"

const getRoles = async(params = {})=> {
    return instance.get("/roles" , {params}).then(res=> res.data);
}




const postRole = async(role)=> {
    return instance.post("/roles", role).then(res=> res.data);
}

const putRole = async({roleId, role})=> {
    return instance.put(`/roles/${roleId}`, role).then(res=> res.data);
}

const deleteRole = async(roleId)=> {
    return instance.delete(`/roles/${roleId}`).then(res=> res.data);
}

export {getRoles, postRole, putRole, deleteRole}