class VotesController < ApplicationController
    # GET /votes
    # GET /votes.json
    def index
        @votes = Vote.order("name").all
        
        respond_to do |format|
            format.html # index.html.erb
            format.json { render json: @votes }
        end
    end
end