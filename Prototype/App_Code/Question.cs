using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Question
/// </summary>
[Serializable()] 
public class Question 
{
    public String label;
    public String ID;
    public Dictionary<String, Answer> options= new Dictionary<string,Answer>();
    public String status = "created";
    public List<String> clients = new List<String>();
	public Question()
	{
		//
		// TODO: Add constructor logic here
		//
	}



    public String toJSON(bool withInner)
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        Question s = this;
        sb.Append("{\"ID\":\"" + s.ID + "\",");
        sb.Append("\"label\":\"" + s.label  + "\",");
        sb.Append("\"status\":\"" + s.status + "\"");

        if (withInner)
        {
            sb.Append(",\"options\":[");
            bool first = true;
            foreach (Answer a in s.options.Values)
            {
                if (first)
                    first = false;
                else
                    sb.Append(",");

                sb.Append(a.toJSON());

            }

            sb.Append("]");

        }

        sb.Append("}");


        return sb.ToString();
    }



    public String resultsToJSON()
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        Question s = this;
        sb.Append("{\"ID\":\"" + s.ID + "\",");
        sb.Append("\"label\":\"" + s.label + "\"");
        

 
            sb.Append(",\"results\":[");
            bool first = true;
            foreach (Answer a in s.options.Values)
            {
                if (first)
                    first = false;
                else
                    sb.Append(",");

                sb.Append(a.resultToJSON ());

            }

            sb.Append("]");

        

        sb.Append("}");


        return sb.ToString();
    }

}