class Api::UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    p user_params
    if @user.save
      render json: { token: @user.session_token, user: @user}
    else
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end

  def user_params
    params.require(:user).permit(:email, :username, :password, :password_confirmation)
  end

  def current
    @user = User.find_by(session_token: params['sessionToken'])
    p @user
    if @user
      render json: { token: @user.session_token, user: @user}
    else
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end
end
