import { useRef } from 'react';
import {useEffect ,useState} from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialValues = {
  name: '',
  subject :'',
  marks :'',
}; 

const Home = () => {
    const [data, setData] = useState([]);
    const [id, setID] = useState('');
    const ref = useRef(null)

    const getalldat =  () =>{
      try {
         fetch('http://localhost:7800/user').then(res => res.json()).then(data =>{setData(data.data)}).catch(er =>  {
          console.log(er);
         });
         return;
      } catch (error) {
        console.log(error);
      }
    }
    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = 
    useFormik({
      initialValues,
      validationSchema: Yup.object({
          name: Yup.string().required("Please enter your name"),
          subject: Yup.string().required("Please enter your subject"),
        }),
      onSubmit: (values, action ) => { 

        if(!values.marks) delete values['marks'];

          // ---->  call backend
            fetch(`http://localhost:7800/update/${id}`,{
              method:'PUT',
              headers:{
                'content-Type': 'application/json',
              },
              body:JSON.stringify(values),

            }).then(res => res.json()).then(data => {toast.success(data.message);}).catch(err => console.log(err));
            getalldat();
            action.resetForm();
      },
    });
    const update = () =>{
      ref.current.click();
    }

    const deleteUser = (id) => {
      fetch(`http://localhost:7800/delete/${id}`,{
        method:'DELETE',
        headers:{
          'content-Type': 'application/json',
        },
      }).then(res => res.json()).then(data => {toast.success(data.message);}).catch(err => console.log(err));
      getalldat();
    }
  
    useEffect(() => {
      getalldat()
    }, [])
  return (
    <>
    <div className="home mx-5 my-5"> 
    <ToastContainer/>

      <div className="text-center my-3 ">  <button type="button" className="btn btn-primary" onClick={() => {}}> Add user </button> </div> 
            
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-center" id="exampleModalLabel"> Update Form </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                  <form className='shadow-lg p-3 mb-5 bg-body rounded'>
                      <div className="mb-3">
                          <input type="text" placeholder='Name' className="form-control" name='name' value={values.name} onChange={handleChange} onBlur={handleBlur} id="exampleInputName1" aria-describedby="NameHelp"/>
                          {errors.name && touched.name ? ( <p style={{'color':'red'}}>{errors.name}</p> ) : null} 
                      </div>
                      <div className="mb-3">
                          <input type="text" placeholder='Subject' className="form-control" name='subject' value={values.subject} onChange={handleChange} onBlur={handleBlur} id="exampleInputPassword1"/>
                          {errors.subject && touched.subject ? ( <p style={{'color':'red'}}>{errors.subject}</p> ) : null} 
                      </div>
                      <div className="mb-3">
                          <input type="number" placeholder='Marks' className="form-control" name='marks' value={values.marks} onChange={handleChange} onBlur={handleBlur} id="exampleInputPassword1"/>
                          {errors.marks && touched.marks ? ( <p style={{'color':'red'}}>{errors.marks}</p> ) : null} 
                      </div>
                  </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-warning" data-bs-target="#exampleModal" data-bs-toggle="modal" ref={ref}  onClick={()=> {handleSubmit()}}>Update</button>
                  </div>
                </div>
              </div>
            </div>

        <table className="table">
            <thead>
                <tr >
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Subject</th>
                <th scope="col">Marks</th>
                <th scope="col">Buttons</th>  
             
                </tr>
            </thead>
            <tbody>
                
                    { data && data.map((ele ,index) => 
                    <>
                    <tr key={index}>
                     <th scope="row">{index+1}</th>
                    <td>{ele.name}</td>
                    <td>{ele.subject}</td>
                    <td>{ele.marks}</td>
                    <td>
                      <button type="button" className="btn btn-warning mx-2" data-bs-target="#exampleModal" data-bs-toggle="modal" ref={ref} onClick = {()=> setID(ele._id)} >Edit</button> 
                      <button type="button" className="btn btn-danger" onClick={() => deleteUser(ele._id)}>Delete</button>
                    </td>
                    </tr>
                    </>
                    )}
            </tbody>
            </table>
            </div>
    </>
  )
}

export default Home