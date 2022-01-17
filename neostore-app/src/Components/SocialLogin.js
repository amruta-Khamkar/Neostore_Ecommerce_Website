import React,{useState} from 'react';
import SocialButton from './SocialButton';
import Page from './Page';
import { SocialIcon } from 'react-social-icons';

export default function SocialLogin() {
    
    const [state,setState]=useState({
        flag:0
    })

    const handleSocialLogin = (user) => {
        console.log(user);
        setState({
            flag:1
        })
      
       
    };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
        alert("Sorry wrong user")
    };
    const clickMe=()=>{
      
    }
    return (
        <div>
            <div>
                {/* <SocialButton
                    provider="facebook"
                    appId="839088120121430"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                >
                    Login with Facebook
                </SocialButton> */}
                <SocialButton
                    provider="google"
                    appId="941644477844-r3f9mn9in6ihn735j15jd7k2m9h8q1kf.apps.googleusercontent.com"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                   
                >
                    Login with Gmail
                </SocialButton>
            </div>
           {
               state.flag==1 && <Page/>
           }

        </div>
    )
}
