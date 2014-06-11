class Api::UsersController < ApplicationController

  def index
    @users = User.all
    render json: @users
  end

  def create
    @user = User.new(user_params)


    if @user.save!
      render json: { token: @user.session_token, user: @user}
    else
      p @user.errors.full_messages
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end

  def user_params
    params.require(:user).permit(:email, :username, :password, :password_confirmation, :permitNsfw, :permissions => [])
  end

  def current
    @user = User.find_by!(session_token: params['sessionToken'])
    if @user
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end

  def update
    @user = User.find_by(id: params['id'])
    if @user.update_attributes(user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: 422
    end
  end
end
