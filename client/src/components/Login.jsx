import React from 'react'
import {Link , useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialValues = {
  email: '',
  password :'',
};


const Login = () => {

  const navigate = useNavigate()

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = 
  useFormik({
    initialValues,
    validationSchema: Yup.object({
        email: Yup.string().email().required("Please enter your Email"),
        password: Yup.string().min(6).max(18).required("Please enter your Password"),
      }),
    onSubmit: async (values, action) => { 
        // const {email,password} = values; 
        // ---->  call backend
          fetch('http://localhost:7800/login',{
            method:'POST',
            headers:{
              'content-Type': 'application/json',
            },
            body:JSON.stringify(values),
          }).then(res => res.json()).then(data => {
            if(data.message == 'invalid credentials') return toast.error(data.message);
            else {
             toast.success(data.message);
             localStorage.setItem('token' , data.token);
             navigate('/');
          }}).catch(err => console.log(err));
        // console.log(values);
       action.resetForm();
    },
  });

  return (
    <>
    <ToastContainer/>
      <div className="login d-flex justify-content-center align-items-center">
        <form className='shadow-lg p-3 mb-5 bg-body rounded'>
            <div className="mb-3">
                <input type="email" placeholder='Email' className="form-control" name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} id="exampleInputEmail1" aria-describedby="emailHelp"/>
                {errors.email && touched.email ? ( <p className="form-error">{errors.email}</p> ) : null} 
            </div>
            <div className="mb-3">
                <input type="password" placeholder='Password' className="form-control" name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} id="exampleInputPassword1"/>
                {errors.password && touched.password ? ( <p className="form-error">{errors.password}</p> ) : null} 
            </div>
              <button onClick={handleSubmit} className="btn btn-primary">Submit</button> 
            <div className="d-flex justify-content-center align-items-center">
            </div>
        </form>
     </div>  
    </>
  )
}

export default Login