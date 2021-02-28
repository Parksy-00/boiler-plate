import React, {useEffect} from 'react';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action'


export default function(SpecificComponent, option, adminRoute = null) {

    //null  =>  아무도 출입 가능
    //true  =>  로그인한 유저만 출입 가능
    //flase  => 로그인 안한 유저만 출입 가능


    function AuthenticationCheck(props) {
        
        const dispatch = useDispatch();
        
        useEffect(() => {

            dispatch(auth())
                .then(response => {
                    console.log(response)
                    // 로그인 하지 않은 상태
                    if(!response.payload.isAuth) {
                        if(option) {
                            props.history.push('/login')
                        }
                    }
                    // 로그인한 상태
                    else {
                        if(adminRoute && !response.payload.isAdmin) {
                            props.history.push('/')
                        }
                        else {
                            if(!option) {
                                props.history.push('/')
                            }
                        }
                    }
                })
            
            axios.get('api/users/auth')
            
        }, [])

        return (
            <SpecificComponent />
        )
    }


    return AuthenticationCheck
}