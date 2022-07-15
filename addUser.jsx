import React, { useState } from "react";
import axios from "axios";

export default function AddUser() {
    const [user,setUser]= useState({
        name:'',
        username:'',
        email:'',
        city:'',
        zipcode:''
    })
    const {name,username,email,city,zipcode} = user;
    const onInputChange = e => {
        setUser({...user,[e.target.name]:e.target.value})
    }
    const onSubmit = () => {
        axios.post('http://localhost:3001/users',user)
    }
  return (
    <div className="container mb-5">
      <form onSubmit={onSubmit()}>
        <div className="mt-lg-5 card">
        <div className="row m-4">
          <label for="inputName" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="name" id="inputName" value={name} onChange={e=>onInputChange(e)} />
          </div>
        </div>
        <div className="row m-4">
          <label for="inputuserName" className="col-sm-2 col-form-label">
            Username
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputuserName" value={username} name="username"  onChange={e=>onInputChange(e)} 
            />
          </div>
        </div>
        <div className="row m-4">
          <label for="inputEmail" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputEmail" value={email} name="email"  onChange={e=>onInputChange(e)}  
            />
          </div>
        </div>
        <div className="row m-4">
          <label for="inputCity" className="col-sm-2 col-form-label">
            city
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputCity" value={city}  name="city"  onChange={e=>onInputChange(e)} 
            />
          </div>
        </div>
        <div className="row m-4">
          <label for="inputzip" className="col-sm-2 col-form-label">
            Zipcode
          </label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="inputzip" value={zipcode}  name="zipcode"  onChange={e=>onInputChange(e)}  
            />
          </div>
        </div>
        <div style={{'text-align-last': 'center'}}>
        <button type="submit" className="btn btn-primary w-auto" >
             Save
        </button>
        </div>
        </div>
      </form>
    </div>
  );
}
