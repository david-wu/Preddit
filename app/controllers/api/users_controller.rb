class Api::UsersController < ApplicationController
  before_action :get_requesting_user

  # shouldn't ever render password_digest/session_token
  def index
    @users = User.all.select(:username, :id, :created_at, :updated_at)
    render json: @users
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:token] = @user.session_token
      render json: @user
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def current
    if @requesting_user
      render json: @requesting_user
    else
      render json: User.new, status: 422
    end
  end

  # should find_by session_token instead of id
  # currently anybody can change anybody's password or whatever
  # i post to users/1/tiles instead of /tiles?username=dawu
  def update
    p params
    @user = User.find_by(session_token: params['sessionToken'])
    if @user.update(user_params[:permissions])
      render json: @user
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  # password_confirmation and permissions should not be permitted
  # they should be outside of the :user object
  private
  def user_params
    params.require(:user).permit(:email, :username, :password, :password_confirmation, :permitNsfw, :permissions => [])
  end
  def get_requesting_user
      @requesting_user = User.find_by(session_token: session[:token])
  end
end
