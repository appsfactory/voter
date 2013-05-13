class UsersController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:update]

  def show
      @user = User.find(params[:id])
  end

  def create
      @user = User.new(params[:user])
      if @user.save
      	 flash[:success] = "Welcome!"
      	 redirect_to @user      	 
      else
	 render '/users/new'
      end
  end

  def new
      @user = User.new
  end

  def edit
      @user = User.find(params[:id])
  end

  def update
      #ONLY WORKS WITH JSON where params contains all required info
      
      #return render :text => "The object is #{params}"
      if User.exists?(:id => params[:user][:id])
	@user = User.find(params[:user][:id])
      	if @user.update_attributes(params[:user])
           respond_to do |format|
	      format.json { render json: "success" }
	   end
      	else
	   respond_to do |format|
	      format.json { render json: "failure" }
	   end
      	end
      else
	respond_to do |format|
	   format.json { render json: "failure_exists" }
	end
      end
  end

  def requestid
      anony = "anon" + String(User.last.id + 1)
      @user = User.create(name: anony, email: anony, password: anony, password_confirmation: anony)
      respond_to do |format|
      #      format.html # index.html.erb
            format.json { render json: @user.id }
      end
  end
end
