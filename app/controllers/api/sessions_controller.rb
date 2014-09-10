class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by(user_params)
    if @user.is_password?(params["user"]["password"])
      @user.reset_token()
      session[:token] = @user.session_token
      render json: @user
    else
      render json: ['Invalid login!'], status: 422
    end
  end

  def destroy
    @requesting_user = User.find_by(session_token: session[:token])
    @requesting_user.reset_token()
    render json: User.new()
  end

  def user_params
    params.require(:user).permit(:username)
  end
end
