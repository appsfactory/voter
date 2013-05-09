module StacksHelper
    def generateID
        return Stack.count + 1
    end
end
