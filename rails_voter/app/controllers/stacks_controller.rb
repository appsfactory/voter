class StacksController < ApplicationController
    # GET /stacks
    # GET /stacks.json
    def index
        @stacks = Stack.order("name").all
        
        respond_to do |format|
            format.html # index.html.erb
            format.json { render json: @stacks }
        end
    end
    
    # GET /stacks/1
    # GET /stacks/1.json
    def show
        @stack = Stack.find(params[:id])
        
        respond_to do |format|
            format.html # show.html.erb
            format.json { render json: @stack }
        end
    end
    
    # GET /stacks/new
    # GET /stacks/new.json
    def new
        @stack = Stack.new
        
        respond_to do |format|
            format.html # new.html.erb
            format.json { render json: @stack }
        end
    end
    
    # GET /stacks/1/edit
    def edit
        @stack = Stack.find(params[:id])
    end

    # GET /stacks/1/present
    def present
        @stack = Stack.find(params[:stack_id])
    end 

    # GET /stacks/1/submitstack
    def submitstack
        @votes = Vote.order("name").all

        @stacks = Stack.where(:name=>params[:stackName])
        @title = params[:stackName]
    end 
    
    # POST /stacks
    # POST /stacks.json
    def create
        @params = params[:stack]
        
        @stack = Stack.new(params[:stack])
        if @params[:name] == ""
            @original = Stack.find(@params[:id])
            
            @stack.id = ""
            @stack.name = @original.name
            else
            logger.debug "not blank"
        end
        
        respond_to do |format|
            if @stack.save
                format.html { redirect_to @stack, notice: 'Stack was successfully created.' }
                format.json { render json: @stack, status: :created, location: @stack }
                else
                format.html { render action: "new" }
                format.json { render json: @stack.errors, status: :unprocessable_entity }
            end
        end
    end
    
    # PUT /stacks/1
    # PUT /stacks/1.json
    def update
        @stack = Stack.find(params[:id])
        
        respond_to do |format|
            if @stack.update_attributes(params[:stack])
                format.html { redirect_to @stack, notice: 'Stack was successfully updated.' }
                format.json { head :no_content }
                else
                format.html { render action: "edit" }
                format.json { render json: @stack.errors, status: :unprocessable_entity }
            end
        end
    end
    
    # DELETE /stacks/1
    # DELETE /stacks/1.json
    def destroy
        @stack = Stack.find(params[:id])
        @stack.destroy
        
        respond_to do |format|
            format.html { redirect_to stacks_url }
            format.json { head :no_content }
        end
    end
end
