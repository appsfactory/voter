using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Results : System.Web.UI.Page
{
    //Declare a  dictionary of surveys
    public static Dictionary<String, Survey>  surveys = new Dictionary<String, Survey>();

    private void loadSurvey()
    {
        lock (surveys)
        {
            try
            {
                System.Runtime.Serialization.Formatters.Binary.BinaryFormatter bf = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();

                using (System.IO.Stream s = new System.IO.FileStream(Server.MapPath(".") + "/surveys.ser", System.IO.FileMode.Open ))
                {

                    surveys = (Dictionary<String, Survey>)bf.Deserialize(s);
                }


            }
            catch (Exception ex)
            {

                throw ex;
                
            }

        }
    }


    private void saveSurvey()
    {
        lock (surveys)
        {
            System.Runtime.Serialization.Formatters.Binary.BinaryFormatter bf = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
            using (System.IO.Stream s = new System.IO.FileStream(Server.MapPath(".") + "/surveys.ser", System.IO.FileMode.Create))
            {
                bf.Serialize(s, surveys);
            }
        }
     }
    protected void Page_Load(object sender, EventArgs e)
    {

        
        String op = Request["op"];
        if (op == null) return;

        loadSurvey();
        switch (op)
        {
            case "createSurvey":createSurvey();
                break;

            case "chooseSurvey": chooseSurvey();
                break;

            case "getClients": getClients();

                break;

            case "moveToNextQuestion": moveToNextQuestion();

                break;

            case "finishSurvey": finishSurvey();

                break;

            case "getSurvey": getSurvey();

                break;


            case "getSurveys": getSurveys();

                break;


            case "getQuestionStatus": getQuestionStatus();
                break;

            case "respondQuestion": respondQuestion();
                break;



            case "getQuestionResults": questionResults();

                break;


        }

        saveSurvey();
    }



    void moveToNextQuestion()
    {
        String ID = Request["id"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            foreach (Question q in s.questions.Values )
            {
                if (q.status.Equals("Open"))
                {
                    q.status = "Closed";
                }

                if (q.status.Equals("created"))
                {
                    q.status = "Open";
                    Response.Write(q.toJSON(false));
                    return;

                }
            }

            Question q1 = new Question();
            q1.ID = "";
            q1.status = "Closed";
            q1.label = "NO MORE QUESTIONS";
            Response.Write(q1.toJSON(false));


        }

    }


    void chooseSurvey()
    {
        String ID = Request["id"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            s.status = "available";
            Response.Write(s.toJSON(false));
        }

    }

    void questionResults()
    {
        String ID = Request["id"];
    
        String qID = Request["questionId"];
        String aID = Request["answerId"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            if (s.status.Equals("available"))
            {
                Question q = s.questions[qID];

                if (q != null )
                {
                    Response.Write(q.resultsToJSON());

                }

            }
        }

    }



    void respondQuestion()
    {
        String ID = Request["id"];
        String custID = Request["customerID"];
        String qID = Request["questionId"];
        String aID = Request["answerId"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            if (s.status.Equals("available"))
            {
                Question q = s.questions[qID];

                if (q != null && q.status.Equals("Open") && !q.clients.Contains(custID))
                {
                    Answer a = q.options[aID];

                    if (a != null)
                    {
                        a.clients.Add(custID);

                        //Set the question as answered
                        q.clients.Add(qID);
                        Response.Write("{\"status\":\"Ok\"}");
                    }


                }

            }
            else
            {
                Response.Write("{\"status\":\"Not available\"}");
            }
        }

    }



    void finishSurvey()
    {
        String ID = Request["id"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            s.status = "finished";
            Response.Write(s.toJSON(false));
        }

    }



    void getSurvey()
    {
        String ID = Request["id"];
        String custID = Request["customerID"];

        writeHeaders();
        Survey s = surveys[ID];
        if (s != null)
        {
            if (!s.clients.Contains(custID)) s.clients.Add(custID);

            Response.Write(s.toJSON(true));
        }

    }




    void getQuestionStatus()
    {
        String ID = Request["id"];
        String qID = Request["questionId"];
        

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
            
            Question q= s.questions[qID];
            String status="";
            if(q!=null)
            {
                status=q.status;
            }else{
                status="unknown";
            }

            Response.Write("{\"ID\":\"" + qID + "\",\"status\":\"" + status + "\"}");
        }

    }

    void getClients()
    {
        String ID = Request["id"];

        writeHeaders();
        if (!surveys.ContainsKey(ID)) return;
        Survey s = surveys[ID];
        if (s != null)
        {
           
            Response.Write("{\"connections\":" + s.clients.Count +"}");
        }

    }

    void getSurveys()
    {
        writeHeaders();

        Response.Write("[");

        bool first = true;
        foreach (Survey s in surveys.Values)
        {

            
            
           
                if (first)
                    first = false;
                else
                    Response.Write (",");
                Response.Write (s.toJSON(false));


        }


        Response.Write("]");
    }






    static System.Text.RegularExpressions.Regex regq = new System.Text.RegularExpressions.Regex("qu(.*)");
    static System.Text.RegularExpressions.Regex rega = new System.Text.RegularExpressions.Regex("qa([^_]*)_(.*)");


    /*
     * 
     * 
     * */

    void createSurvey()
    {

        String ID = Request["id"];
        String name = Request["name"];
        Survey survey = new Survey();
        survey.ID = ID;
        survey.name = name;

        //Iterate for all posible questions

        foreach (String key in Request.Params.Keys)
        {
            if (key == null) continue;
            // Question should be in the format quXXX
            if (key.StartsWith("qu"))
            {

                String questionID = regq.Match(key).Groups[1].Value; //key.Substring(2, key.Length - 2);
                Question q;
                if (!survey.questions.ContainsKey(questionID))
                {
                    q = new Question();
                    q.label = Request.Params[key];
                    q.ID = questionID;
                    survey.questions.Add(q.ID, q);
                }
            }

            // Answers should be in the format qaXXX_YYY  where XXX is the ID of the question and XXX the ID of the answer
            if (key.StartsWith("qa"))
            {
                System.Text.RegularExpressions.Match m = rega.Match(key);
                
                //int idIndex = key.IndexOf("_");
                String questionID = m.Groups[1].Value ;                
                String answerID = m.Groups[2].Value;

                //Get the question
                Question q = survey.questions[questionID];

                if (!q.options.ContainsKey(answerID))
                {
                    Answer opt = new Answer();
                    opt.ID = answerID;
                    opt.label = Request.Params[key];
                    opt.isCorrect = Request.Params["c" + key] != null; //Correct answer should have a value of type cqaxxx_YYY
                    q.options.Add(opt.ID, opt);
                }
                
            }





        }

        if (!surveys.ContainsKey(ID))
        {
            surveys.Add (ID,survey);
        }
        else
        {
            surveys[ID] = survey;
        }

        writeHeaders();
        Response.Write(survey.toJSON(true));
    }
   /*
    * 
    * Write Common Headers
    * */
     void writeHeaders()
    {
        Response.ContentType = "application/json";
        Random r = new Random();
        Response.Clear();
        Response.Headers.Add("Access-Control-Allow-Origin", Request.UserHostAddress);
        Response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        Response.Headers.Add("Access-Control-Max-Age", "1000");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

    }
}