function Register(){
    return(
        <>
        <h1>Student Resgistration</h1>
        <form id="form1">
            <input type="text" id="firstname" placeholder="firstname"/>
            <input type="text" id="secondname" placeholder="median name"/>
            <input type="text" id="lastname" placeholder="last name"/>
            <input type="text" id="IDnumber" placeholder="ID number"/>
            <input type="text" id="cellnumber" placeholder="cell number"/>
            <input type="text" id="altnumber" placeholder="alternate cell number"/>
            <input type="text" id="email" placeholder="email"/>
            <input type="text" id="ethnicgroup" placeholder="ethnic group"/>
            <input type="text" id="password" placeholder="password"/>
            <input type="submit"/>
        </form>
       
        <p>Have an account?<a href="/login">Sign in</a></p>
    
        </>
    )
}

export default Register;