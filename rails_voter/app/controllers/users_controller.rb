class UsersController < ApplicationController
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
  end

  def requestid
      anony = "anon" + String(User.last.id + 1)
      @user = User.create(name: anony, email: anony, password: anony, password_confirmation: anony)
      return @user.id
  end

  def claim
      if User.exists?(:id => params[:user][:id])
      	 @user = User.find_by_id(params[:user][:id])
	 if @user.update_attributes(params[:user])
      	    response = "success"
	 else
	    response = "failure"
	 end
      else
         response = "failure"
      end
  end

  def submitclaim
      @user = User.find_by_id(params[:user][:id])
  end

  def newbyid
      @temp_user = User.new
  end

  def createbyid
      @temp_user = User.new(params[:user])
      if User.exists?(:id => @temp_user.id)     
      	@user = User.find(@temp_user.id)
	@user = @temp_user 
	if @user.save
      	    redirect_to @user
      	else
	    render '/users/newbyid'
        end
      else
	render '/users/newbyid'
      end
  end
end
