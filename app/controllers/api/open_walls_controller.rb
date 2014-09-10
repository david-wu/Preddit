class Api::OpenWallsController < ApplicationController

  before_action :get_requesting_user

	def index
    if @requesting_user
      @open_walls = OpenWall.where(user_id: @requesting_user.id).order(created_at: :desc)
      render json: @open_walls
    else
      render json: []
    end
	end

	def create
    if @requesting_user
  		@open_wall = OpenWall.new(open_walls_params)
  		@open_wall.user_id = @requesting_user.id
      if @open_wall.save
        render json: @open_wall
      else
        render json: @open_wall.errors.full_messages, status: 422
      end
    else
      render json: []
    end
	end

  private

  def open_walls_params
    params.require(:open_wall).permit(:name, :is_feed)
  end

  def get_requesting_user
    @requesting_user = User.find_by(session_token: session[:token])
  end

end
