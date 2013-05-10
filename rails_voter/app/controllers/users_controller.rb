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
