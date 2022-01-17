import jwt_decode from 'jwt-decode'

export const cartLength = (state = 0, action) => {
    console.log(state)
    switch (action.type) {
        case "cartLen":
            if (localStorage.getItem("_token") && !(localStorage.getItem("cartData"))) {
                let token = localStorage.getItem("_token");
                let decode = jwt_decode(token);
                return decode.cartData.length;
            }
            else if ((localStorage.getItem("_token") && localStorage.getItem('cartData'))) {
                return JSON.parse(localStorage.getItem("cartData")).length
            }
            else if (!localStorage.getItem("_token")) {
                if (localStorage.getItem("cartData")) {
                    return JSON.parse(localStorage.getItem("cartData")).length
                }
                else {
                    return 0;
                }
            }

        case "addCart": return state + 1;
        case "delCart": return state - 1;
        case "logout": return 0;
        case "oldCart": return action.payload;
        default: return 0
    }

}

export const loginReducer=(state=false,action)=>{
    switch(action.type){
        case "login":if(localStorage.getItem("_token")){
            return true
        }
        else{
            return false;
        }
        default: return state
    }
}


