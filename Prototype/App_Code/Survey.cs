using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Survey
/// </summary>
public class Survey
{
    public String name;
    public String ID;
    public Dictionary<String, Question> questions = new Dictionary<string,Question>();
    public String status = "unavailable";

    public List<String> clients= new List<String>();


	public Survey()
	{
       
		
	}


    public String toJSON(bool withInner)
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        Survey s = this;
        sb.Append("{\"ID\":\"" + s.ID + "\",");
        sb.Append("\"label\":\"" + s.name + "\",");
        sb.Append("\"status\":\"" + s.status + "\"");

        if (withInner)
        {
            sb.Append(",\"questions\":[");
            bool first = true;
            foreach (Question a in s.questions.Values)
            {
                if (first)
                    first = false;
                else
                    sb.Append(",");

                sb.Append(a.toJSON(withInner));

            }

            sb.Append("]");
        }


        


        sb.Append("}");


        return sb.ToString();
    }
}