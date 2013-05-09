module ApplicationHelper
    
    def parseChoices(str)
        if str == nil
            return ["None"]
        end
        
        return str.split("~")
    end
    
end
