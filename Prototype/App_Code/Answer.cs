using System;
using System.Collections.Generic;
using System.Web;

/// <summary>
/// Summary description for Answer
/// </summary>
public class Answer
{
    public String ID;
    public String label;
    public bool isCorrect;

    public List<String> clients = new List<String>();

	public Answer()
	{
		//
		// TODO: Add constructor logic here
		//
	}

    public String toJSON()
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        Answer s = this;
        sb.Append("{\"ID\":\"" + s.ID + "\",");
        sb.Append("\"label\":\"" + s.label + "\" ");
        sb.Append("}");


        return sb.ToString();
    }


    public String resultToJSON()
    {
        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        Answer s = this;
        sb.Append("{\"ID\":\"" + s.ID + "\",");
        sb.Append("\"label\":\"" + s.label + "\" ");
        sb.Append("\"value\":\"" + s.clients.Count  + "\" ");
        sb.Append("}");


        return sb.ToString();
    }

}