using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Results : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "application/json";

        Random r= new Random();

        Response.Clear();

        Response.Headers.Add("Access-Control-Allow-Origin", Request.UserHostAddress);
        Response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        Response.Headers.Add("Access-Control-Max-Age", "1000");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        Response.Write("{ \"question\":\"What colour is the sky\", \"answers\":[{\"label\":\"blue\",\"value\":" + r.Next(150) + " },{\"label\":\"green\",\"value\":" + r.Next(150) + " },{\"label\":\"yellow\",\"value\":" + r.Next(150) + " }]}");
        Response.End();

    }
}