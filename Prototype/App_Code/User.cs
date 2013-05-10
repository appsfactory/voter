using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Survey
/// </summary>
/// 
[Serializable()]
public class User
{
    public String user;
    public String password;
    public String token;
    public bool isAdmin;
   

	public User()
	{
       
		
	}

}